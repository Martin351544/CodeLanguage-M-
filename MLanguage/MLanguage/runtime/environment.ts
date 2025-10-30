import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeVal } from "./values.ts";

function stringifyRuntime(val: any): unknown {
  switch (val?.type) {
    case "number":   return val.value;
    case "string":   return val.value;
    case "boolean":  return val.value ? "true" : "false";
    case "null":     return "null";
    case "object":   return "[object]";
    case "function": return "[function]";
    case "native-fn":return "[native fn]";
    default:         return (val && "value" in val) ? val.value : val;
  }
}

export function createGlobalEnv() {
  const env = new Environment
  // env.declareVar("c", MK_NUMBER(300000), true);
  // env.declareVar("e", MK_NUMBER(2.71828), true);
  // env.declareVar("g", MK_NUMBER(9.81), true);
  // env.declareVar("pi", MK_NUMBER(3.141592654), true);
  // env.declareVar("GoldenRatio", MK_NUMBER(1.618), true);
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);

  env.declareVar(
    "output",
    MK_NATIVE_FN((args, scope) => {
      console.log(...args.map(stringifyRuntime));
      return MK_NULL();
    }),
    true
  );


  function timeFunction(_args: RuntimeVal[], _env: Environment) {
    return MK_NUMBER(Date.now());
  }
  env.declareVar("time", MK_NATIVE_FN(timeFunction), true )

  return env;
}


export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();

    
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);


    if (env.constants.has(varname)) {
      throw `Cannot reasign to variable ${varname} as it was declared constant.`;
    }

    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent.resolve(varname);
  }
}
