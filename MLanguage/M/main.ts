<<<<<<< HEAD
//on pc cd to C:\Users\Admin\Documents\GitHub\CodeLanguage-M-\MLanguage\M
//on computer cd to C:\Users\marti\OneDrive\Documents\GitHub\CodeLanguage-M-\MLanguage\M
//type deno run main.ts
=======
>>>>>>> parent of b2d6235 (added var decleration)
import Parser from "./Frontend/parser.ts";
import Environment from "./Runtime/enviornment.ts";
import { evaluate } from "./Runtime/interpreter.ts";
import { MK_Bool, MK_NULL, MK_NUMBER } from "./Runtime/values.ts";

repl();

function repl() {
  const parser = new Parser();
  const env = new Enviornment();
<<<<<<< HEAD
  env.declareVar("g", MK_NUMBER(10), true);
  env.declareVar("true", MK_Bool(true), true);
  env.declareVar("false", MK_Bool(false), true);
  env.declareVar("null", MK_NULL(), true);
=======
  env.declareVar("x", MK_NUMBER(100));
  env.declareVar("true", MK_Bool(true));
  env.declareVar("false", MK_Bool(false));
  env.declareVar("null", MK_NULL());
>>>>>>> parent of b2d6235 (added var decleration)
  console.log("\nRepl v0.1");

  
  while (true) {
    const input = prompt("> ");
    
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input);


    const result = evaluate(program, env);
    console.log(result);

  }
}