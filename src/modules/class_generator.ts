import * as u from "./util";

/**
 * @example Human.
 * @example Human<IPerson.
 * @example Human<IPerson.name:string
 * @example Human<IPerson.name:string,-age:number
 * @example Human<IPerson.-name:string,-age:number
 */
export default function ClassGen(input: string): string {
    let name: string;
    let fieldSpecInput: string;
    let fieldArr: u.Field[];
    let fieldList: string[];
    let privatefields: u.Field[];
    let publicfields: u.Field[];
    let superclass: string;
    let params: string;
    let fields: string;
    let lines: string[];

    [name, fieldSpecInput] = input.split(".", 2);
    if (name.match(/</)) {
        [name, superclass] = name.split("<", 2);
        name = name + " implements " + superclass;
    }
    fieldArr = fieldSpecInput
        .split(",")
        .map(u.MakeField)
        .filter((x) => x != null);

    // will only be listed in the class
    privatefields = fieldArr.filter((x: u.Field) => x.private);
    // will be listed in the constructor
    publicfields = fieldArr.filter((x: u.Field) => !x.private);

    // Generate our private field list
    lines = privatefields.map((x: u.Field) => `${x.name}: ${x.type};`);
    // generate our constructor's parameters
    params = publicfields
        .map((x: u.Field): string => `public ${x.name}: ${x.type}`)
        .join(", ");
    if (params != "") {
        params = `constructor(${params})`;
        lines.push(params);
    }

    return `class ${name} {${u.JamLines(lines)}}`;
}
