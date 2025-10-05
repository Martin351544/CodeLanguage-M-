import { Program, VarDecleration } from "../../Frontend/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, MK_Bool } from "../values.ts";

export function eval_program(program: Program, env: Enviornment): RuntimeVal {

  let lastEvaluated: RuntimeVal = MK_NULL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function eval_var_devleration(decleration: VarDecleration, env: Enviornment): RuntimeVal {
    const value = decleration.value ? evaluate(decleration.value, env) : MK_NULL();

    return env.declareVar(decleration.identifier, value, decleration.constant);
}
