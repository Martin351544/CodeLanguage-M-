// cd to C:\Users\Admin\Documents\GitHub\CodeLanguage-M-\MLanguage\M
// type deno run main.ts
import Parser from "./Frontend/parser.ts";
import Enviornment from "./Runtime/enviornment.ts";
import { evaluate } from "./Runtime/interpreter.ts";
import { MK_Bool, MK_NULL, MK_NUMBER } from "./Runtime/values.ts";

repl();

function repl() {
  const parser = new Parser();
  const env = new Enviornment();
  env.declareVar("x", MK_NUMBER(100), false);
  env.declareVar("true", MK_Bool(true), true);
  env.declareVar("false", MK_Bool(false), true);
  env.declareVar("null", MK_NULL(), true);
  console.log("\nRepl v0.1");

  
  while (true) {
    const input = prompt("> ");
    
    if (!input || input.includes("$exit")) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input);


    const result = evaluate(program, env);
    console.log(result);

  }
}