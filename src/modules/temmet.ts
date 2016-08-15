import * as u from "./util"
import ClassGen from "./class_generator"
import InterfaceGen from "./interface_generator"

export const CURSOR_HERE: string = u.CURSOR_HERE;

export function Expand(input: string): string {
    let f: u.ITextTransformer
    if (input.match(/\w\./)) { f = ClassGen }
    else if (input.match(/\w>/)) { f = InterfaceGen }
    if(f == null) {
        throw new Error("Not recognized");
    }
    return f(input);
}
