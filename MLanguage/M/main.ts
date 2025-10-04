import Parser from "./Frontend/parser.ts";
import { evaluate } from "./Runtime/interpreter.ts";

repl();

function repl() {
  const parser = new Parser();
  console.log("\nRepl v0.1");

  
  while (true) {
    const input = prompt("> ");
    
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input);


    const result = evaluate(program);
    console.log(result);

  }
}