# TemmeT

[Emmet](http://emmet.io)-style TypeScript expansion framework.


## Examples

- `IPerson>`

   ```typescript
   interface IPerson {}
   ```

- `IPerson>firstName:string,lastName:string`

   ```typescript
   interface IPerson {
       firstName: string;
       lastName: string;
   }
   ```

- `IPerson<IAnimal>`

   ```typescript
   interface IPerson extends IAnimal {}
   ```

- `IPerson<IAnimal>firstName:string,lastName:string`

   ```typescript
   interface IPerson extends IAnimal {
       firstName: string;
       lastName: string;
   }
   ```

- `Person.-firstName:string,lastName:string`

   ```typescript
   class Person {
       firstName: string;
       constructor(public lastName: string){}
   }
   ```

- `Person.firstName:string`

   ```typescript
   class Person {
       constructor(public firstName: string){}
   }
   ```

- `Human.`

   ```typescript
   class Human {}
   ```

- `Human<IPerson.`

   ```typescript
   class Human implements IPerson {}
   ```

- `Human<IPerson.name:string`

   ```typescript
   class Human implements IPerson {
       constructor(public name: string){}
   }
   ```

- `Human<IPerson.name:string,-age:number`

   ```typescript
   class Human implements IPerson {
       age: number;
       constructor(public name: string){}
   }
   ```

- `Human<IPerson.-name:string,-age:number`

   ```typescript
   class Human implements IPerson {
       name: string;
       age: number;
   }
   ```
