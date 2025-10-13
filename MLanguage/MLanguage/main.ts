import Parser from "./frontend/parser.ts";
import { loadMsFile } from "./loadMsFIle.ts";
import Environment, { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";




run("test.Ms");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = await loadMsFile(filename);
  const program = parser.produceAST(input);

  const _result = evaluate(program, env);
}

function _repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
  
  console.log("\nRepl v0.1");

  while (true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    const program = parser.produceAST(input);

    const _result = evaluate(program, env);
  }
}
