/// <reference path="../headers/requirejs/require.d.ts" />
import SuperScript from "../src/modules/temmet";

// And some basic tests to show off the functionality...

let tests: string[];
tests = [
    "IPerson>",
    "IPerson>firstName:string,lastName:string",
    "IPerson<IAnimal>",
    "IPerson<IAnimal>firstName:string,lastName:string",
    "Person.-firstName:string,lastName:string",
    "Person.firstName:string",
    "Human.",
    "Human<IPerson.",
    "Human<IPerson.name:string",
    "Human<IPerson.name:string,-age:number",
    "Human<IPerson.-name:string,-age:number"
]

for (let test of tests) {
    console.log(SuperScript(test));
}
