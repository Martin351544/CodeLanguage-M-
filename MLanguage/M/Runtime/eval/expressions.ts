import { BinaryExpr, Identifier } from "../../Frontend/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, NullVal } from "../values.ts";

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

export function eval_binary_expr (binop: BinaryExpr, env: Enviornment): RuntimeVal {
  
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  if(lhs.type == "number" && rhs.type == "number"){
    return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
  }

  return { type: "null", value: null } as NullVal;
}

export function eval_identifier(ident: Identifier, env: Enviornment ): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}

export function eval_assignment (node: AssignmentExpr, env: Enviornment): RuntimeVal {
  if(node.assigne.kind !== "Identifier") 
    throw `invalid LHS inside assignment expr ${JSON.stringify(node.assigne)}`;
  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value));
}