import * as u from "./util"

/**
 * @example IPerson>
 * @example IPerson>firstName:string,lastName:string
 * @example IPerson<IAnimal>firstName:string,lastName:string
 */
export default function InterfaceGen(input: string): string {
    let name: string;
    let fieldstr: string;
    let fieldLines: string[];
    let params: string;
    let superclass: string;

    [name, fieldstr] = input.split(">", 2);
    if (name.match(/</)) {
        [name, superclass] = name.split("<", 2);
        name = name + " extends " + superclass;
    }

    fieldLines =
        fieldstr
        .split(",")
        .map(u.MakeField)
        .filter((x: u.Field): boolean => x != null)
        .map((x: u.Field): string => `${x.name}: ${x.type};`);

    return `interface ${name} {${u.JamLines(fieldLines)}}`;
}
