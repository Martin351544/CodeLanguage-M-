import { NumberVal, RuntimeVal } from "./values.ts";


export default class Enviornment {

    private parent?: Enviornment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor (parentENV?: Enviornment) {
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVar (varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
        if (this.variables.has(varname)){
            throw `Cannot declare variable ${varname}. As it is already defined`;
        }

        this.variables.set(varname, value);

        if (constant) {
            this.constants.add(varname);
        }
        return value;
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        if(env.constants.has(varname)) {
            throw `cannot reassign variable ${varname} as it is a constant.`
        }
        env.variables.set(varname, value);

        return value;
    }

    public lookupVar (varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve(varname: string): Enviornment {
        if(this.variables.has(varname))
            return this;
        if (this.parent == undefined)
            throw `Cannot resolve "${varname}" as it does not exist`;

        return this.parent.resolve(varname);
    }

}