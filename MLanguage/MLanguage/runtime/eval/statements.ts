import { FunctionDecleration, IfStmt, Program, VarDeclaration, WhileStmt } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanVal, FunctionVal, MK_NULL, NumberVal, RuntimeVal } from "../values.ts";

export function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function eval_var_declaration(
  declaration: VarDeclaration,
  env: Environment,
): RuntimeVal {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();

  return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_decleration(
  declaration: FunctionDecleration,
  env: Environment,
): RuntimeVal {

  const fn = {
    type: "function",
    name: declaration.name,
    parameters: declaration.parameters,
    declerationEnv: env,
    body: declaration.body,
  } as FunctionVal

  return env.declareVar(declaration.name, fn, true);
}

export function eval_if_decleration(ifNode: IfStmt, env: Environment): RuntimeVal {

  if (!ifNode.condition) {
    return MK_NULL();
  }

  const condVal = evaluate(ifNode.condition, env);

  function isTruthy(val: RuntimeVal): boolean {
    if(val.type === "boolean") {
      return (val as BooleanVal).value;
    }
    if(val.type === "number") {
      return (val as NumberVal).value != 0;
    }
    if(val.type === "null") {
      return false;
    } 

    return true;
  }

  if(isTruthy(condVal)) {
    const branchEnv = new Environment(env);
    return evaluate(ifNode.thenBranch, branchEnv);
  } else if (ifNode.elseBranch) {
    const branchEnv = new Environment(env);
    return evaluate(ifNode.elseBranch, branchEnv);
  }

  return MK_NULL();
}

export function eval_while_decleration(whileNode: WhileStmt, env: Environment): RuntimeVal {
  if (!whileNode.condition) return MK_NULL();

  function isTruthy(val: RuntimeVal): boolean {
    if (val.type === "boolean") return (val as BooleanVal).value;
    if (val.type === "number")  return (val as NumberVal).value != 0;
    if (val.type === "null")    return false;
    return true;
  }

  let last: RuntimeVal = MK_NULL();
  while (isTruthy(evaluate(whileNode.condition, env))) {
    const loopEnv = new Environment(env);
    last = evaluate(whileNode.body, loopEnv);
  }
  return last;
}
