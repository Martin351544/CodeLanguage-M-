import { Expr, Stmt } from "../frontend/ast.ts";
import Environment from "./environment.ts";

export type ValueType = "null" | "number" | "string" | "boolean" | "object" | "array" | "native-fn" | "function" | "if";

export interface RuntimeVal {
  type: ValueType;
}


export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export function MK_NULL() {
  return { type: "null", value: null } as NullVal;
}

export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export function MK_BOOL(b = true) {
  return { type: "boolean", value: b } as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MK_NUMBER(n = 0) {
  return { type: "number", value: n } as NumberVal;
}

export interface StringVal extends RuntimeVal {
  type: "string";
  value: string;
}

export function MK_STRING(s: string) {
  return { value: s, type: "string" } as StringVal;
}

export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export interface ArrayVal extends RuntimeVal {
  type: "array";
  elements: RuntimeVal[];
}

export function MK_ARRAY(elements: RuntimeVal[] = []) {
  return { type: "array", elements } as ArrayVal;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal ;

export interface NativeFnValue extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}

export function MK_NATIVE_FN(call: FunctionCall) {
  return { type: "native-fn", call } as NativeFnValue
}


export interface FunctionVal extends RuntimeVal {
  type: "function";
  name: string;
  parameters: string[];
  declerationEnv: Environment;
  body: Stmt[];
}
