// deno-lint-ignore-file no-explicit-any
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
  Stmt,
  VarDeclaration,
} from "./ast.ts";

import { Token, tokenize, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }


  private at() {
    return this.tokens[0] as Token;
  }


  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      Deno.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  private parse_stmt(): Stmt {

    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      default:
        return this.parse_expr();
    }
  }

  parse_var_declaration(): Stmt {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords.",
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat(); 
      if (isConstant) {
        throw "Must assigne value to constant expression. No value provided.";
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration.",
    );

    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statment must end with semicolon.",
    );

    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr(); 

    if (this.at().type == TokenType.Equals) {
      this.eat(); 
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  parse_object_expr(): Expr {
    if (this.at().type != TokenType.OpenBrace){
      return this.parse_additive_expr();
    }

    this.eat();
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(TokenType.Identifier, "Object Literal key expected").value;
      
      if(this.at().type == TokenType.Comma) {
        // ! COMMA IS TAKEN CARE OF HERE BUT FOR SOME REASON IT DON'T WORK (COMMA ERROR)
        this.eat();
        properties.push({key, kind: "Property"} as Property); // !KEY COULD BE WRONG HERE (COMMA ERROR) 
        continue;
      } else if(this.at().type == TokenType.CloseBrace) {
        properties.push({key, kind: "Property", value: undefined} as Property);
        continue;
      }

      this.expect(TokenType.Colon, "missing colon following identifier in objectExpr")
      const value = this.parse_expr();

      properties.push({ kind: "Property", value, key});
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(TokenType.Comma, "Expected comma or closing bracket following property");
        
      }
    }

    this.expect(TokenType.CloseBrace, "Object literal missing closing brace");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral; 
  }
  
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicitave_expr(): Expr {
    let left = this.parse_call_member_expr();

    while (
      this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }
  
  private parse_call_member_expr(): Expr {
    const member = this.parse_member_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }

    return member;
  }

  private parse_call_expr(caller: Expr): Expr {

    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type == TokenType.OpenParen) {
      
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }


  // ! COMMA BETWEEN 2 ARGS IS GIVING A PREDEFINED ERROR (COMMA ERROR)
  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open parenthesis");
    const args = this.at().type == TokenType.CloseParen
      ? []
      : this.parse_arguments_list(); // !LIST WHERE THE COMMA IS TAKEN CARE OF BUT CLEARLY NOT WORKING (COMMA ERROR)
      
    this.expect(TokenType.CloseParen, "missing closing parenthisis in argument list" );

    return args;
  }

  // !!!!MOST PROBABLY IN HERE BETWEEN 2 ARGS  (COMMA ERROR)
  private parse_arguments_list(): Expr[] {
    const args = [this.parse_expr()];
    
    while (this.at().type == TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }

    return args;
  }


  // !ERROR MIGHT COME FROM HERE PARSE MEMBER IS EITHER NOT CALLED OR RETURNS NULL OR THE TYPE OF COMMA IS WRONG (COMMA ERROR)
  private parse_member_expr(): Expr {
    let object = this.parse_primary_expr();

    while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
      const operator = this.eat();
      let property: Expr;
      let computed: boolean;

      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_primary_expr();

        if(property.kind != "Identifier") {
          throw `Cannot use dot operator without right hand side being an identifier`;
        }
      }else {
        computed = true;
        property = this.parse_expr();
        this.expect(TokenType.CloseBracket, "Missing closing bracket in computed value")
      }
    
      object = { 
        kind: "MemberExpr",
        object,
        property,
        computed,
      } as MemberExpr
    
    }

    // !MIGHT RETURN NULL (COMMA ERROR)
    return object;
  }


  // !PROBABLY HERE IF CALLED WRONG (COMMA ERROR)
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {

      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;


      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;


      case TokenType.OpenParen: {
        this.eat(); 
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        ); 
        return value;
      }

     // !ERROR CAN ALSO COME FROM HERE IF TYPE IS WRONG OR PARSE MEMBER NOT CALLED SO IT GOES TO DEFAULT (COMMA ERROR)
      default:
        console.error("Unexpected token found during parsing!", this.at()); // !THIS GETS CALLED(AFTER ALOT OF FUNCTIONS) AND I GET THIS ERROR...
        Deno.exit(1);
    }
  }

  
  // !ORDERS OF PRESEDENCE
  // !ADDITIVE EXPR
  // !MULTIPLICATIVE EXPR
  // !PRIMARY EXPR

  // ! ... ! ... ! ... ! ... ! 
  // !POSSIBLE REASONS FOR PREDEFINED COMMA ERROR :
  // !!! ARGS LIST NOT TAKEN CARE OF PROPERLY
  // !!!CALL PRIMARY EXPR BEFORE NEEDED 
  // !!OBJECT MIGHT RETURN NULL
  // !WONG TYPE OF COMMA
}
