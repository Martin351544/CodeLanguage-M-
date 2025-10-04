import { NullVal ,NumberVal ,ValueTypes, RuntimeVal } from "./values.ts"
import { NodeType, NumericLiteral, Stmt } from "../Frontend/ast.ts"


export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    
    case "NullLiteral":
        return { value: "null", type: "null" } as NullVal;

    default:
        console.error("This AST Node has not yet been set up for interpretation", astNode);
        Deno.exit(1);
  }
}