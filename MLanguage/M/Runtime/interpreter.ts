import { NumberVal , RuntimeVal } from "./values.ts"
import { BinaryExpr, Identifier, NumericLiteral, Program, Stmt, VarDecleration } from "../Frontend/ast.ts"
import Enviornment from "./enviornment.ts";
import { eval_program, eval_var_devleration } from "./eval/staements.ts";
import { eval_binary_expr, eval_identifier } from "./eval/expressions.ts";





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
    
    case "VarDecleration":
      return eval_var_devleration(astNode as VarDecleration, env);
    default:
        console.error("This AST Node has not yet been set up for interpretation", astNode);
        Deno.exit(1);
  }
}


