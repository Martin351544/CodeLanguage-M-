import { MK_NULL, NumberVal, RuntimeVal, StringVal, ArrayVal, MK_ARRAY } from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  BlockStmt,
  CallExpr,
  FunctionDecleration,
  Identifier,
  IfStmt,
  NumericLiteral,
  ObjectLiteral,
  ArrayLiteral,
  Program,
  Stmt,
  StringLiteral,
  VarDeclaration,
  WhileStmt,
  MemberExpr,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_function_decleration, eval_if_decleration, eval_program, eval_var_declaration, eval_while_decleration } from "./eval/statements.ts";
import {
  eval_assignment,
  eval_binary_expr,
  eval_call_expr,
  eval_identifier,
  eval_object_expr,
  eval_member_expr,
} from "./eval/expressions.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "StringLiteral":
      return {
        value: ((astNode as StringLiteral).value),
        type: "string",
      } as StringVal;
    case "ArrayLiteral": {
      const arrNode = astNode as ArrayLiteral;
      const elements = arrNode.elements.map(el => evaluate(el, env));
      return MK_ARRAY(elements);
    }
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "MemberExpr":
      return eval_member_expr(astNode as MemberExpr, env);
    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env);
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "IfDecleration":
      return eval_if_decleration(astNode as IfStmt, env);
    case "WhileDecleration":
      return eval_while_decleration(astNode as WhileStmt, env);
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);
    case "FunctionDecleration":
      return eval_function_decleration(astNode as FunctionDecleration, env);
    case "BlockStmt": {
      const blockEnv = new Environment(env); 
      let result: RuntimeVal = MK_NULL();
      for (const stmt of (astNode as BlockStmt).body) {
        result = evaluate(stmt, blockEnv);
      }
      return result;
    }

    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      Deno.exit(0);
  }
}
