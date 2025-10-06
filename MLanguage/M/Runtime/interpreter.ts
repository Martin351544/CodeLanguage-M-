import { NullVal ,NumberVal ,ValueTypes, RuntimeVal, MK_NULL } from "./values.ts"
import { BinaryExpr, Identifier, NodeType, NumericLiteral, Program, Stmt } from "../Frontend/ast.ts"
import Enviornment from "./enviornment.ts";
<<<<<<< HEAD
import { eval_program, eval_var_devleration } from "./eval/staements.ts";
import { eval_binary_expr, eval_identifier, eval_assignment } from "./eval/expressions.ts";
=======
>>>>>>> parent of b2d6235 (added var decleration)


function eval_program(program: Program, env: Enviornment): RuntimeVal {

  let lastEvaluated: RuntimeVal = MK_NULL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
  let result: number;
  if(operator == "+")
    result = lhs.value + rhs.value;
  else if (operator == "-")
    result = lhs.value - rhs.value;
  else if (operator == "*")
    result = lhs.value * rhs.value;
  else if (operator == "/")
    result = lhs.value / rhs.value;
  else{
    result = lhs.value % rhs.value;
  }

  return { value: result, type: "number" };
}

function eval_binary_expr (binop: BinaryExpr, env: Enviornment): RuntimeVal {
  
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  if(lhs.type == "number" && rhs.type == "number"){
    return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
  }

  return { type: "null", value: null } as NullVal;
}

function eval_identifier(ident: Identifier, env: Enviornment ): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}

export function evaluate(astNode: Stmt, env: Enviornment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "Identifier":
      return eval_identifier (astNode as Identifier, env);
<<<<<<< HEAD
      case "AssignmentExpr":
        return eval_assignment(astNode, env);
    
    case "VarDecleration":
      return eval_var_devleration(astNode as VarDecleration, env);
=======
>>>>>>> parent of b2d6235 (added var decleration)
    default:
        console.error("This AST Node has not yet been set up for interpretation", astNode);
        Deno.exit(1);
  }
}