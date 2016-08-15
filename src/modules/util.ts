/**
 * @desc Transforms one string into another
 * @example (x: string) => "hello " + x
 */
export interface ITextTransformer { (input: string): string; }

/**
 * @desc Take a bunch of `lines` and jam them together into one
 *       string, indented
 */
export function JamLines(lines: string[], indent: boolean = true, indentAmount: number = 4): string {
    if (lines.length < 1) {
        return "";
    }
    if (indent) {
        // split/join => search/replace
        return ("\n" + lines.join("\n"))
            .split("\n")
            .join("\n" + Array(indentAmount + 1).join(" "))
            + "\n";
    }
    return "\n" + lines.join("\n") + "\n";
}


/**
 * @desc Creates a Field object from a string
 * @example "-name:type" (private field)
 * @example "name:type" (public field)
 */
export type Field = { name: string, type: string, private?: boolean };

const TypeShortcuts = {
    "s": "string",
    "n": "number"
}
export function MakeField(fieldspec: string) {
    let [n, t] = fieldspec.split(":", 2);
    let p: boolean = true;
    if (t == null) t = "";
    if (n == "" && t == "") return null;
    // if the name begins with '-', it's supposed to be private
    if (n.charAt(0) == '+') {
        n = n.slice(1);
        p = false;
    }
    for (let replacement in TypeShortcuts)
        if (t == replacement)
            t = TypeShortcuts[replacement]; 

    return {name: n, type: t, private: p};
}

export type Templater = {
    name_upper_delim: string,
    upper_upper_delim: string,
    nameupper_members_delim: string,
    member_member_delim: string
}
export function SplitInput(s: string, t: Templater): string {
    let nameupper: string;
    let name: string;
    let upperupper: string;
    let membermember: string;
    let uppers: string[];
    let members: string[];

    [nameupper, membermember] = s.split(t.nameupper_members_delim, 2);
    [name, upperupper] = s.split(t.name_upper_delim, 2);
    uppers = upperupper.split(t.upper_upper_delim);
    members = membermember.split(t.member_member_delim);
    return "";
}
