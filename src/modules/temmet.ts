import * as u from "./util"
import ClassGen from "./class_generator"
import InterfaceGen from "./interface_generator"

export default function TemmeT(input: string): string {
    let f: u.ITextTransformer
    if (input.match(/\w\./)) { f = ClassGen }
    else if (input.match(/\w>/)) { f = InterfaceGen }
    return f == null ? input : f(input);
}
