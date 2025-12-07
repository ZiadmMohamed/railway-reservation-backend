 import bcrypt, { compareSync, hashSync } from "bcrypt"
 
export   function hash(plainText:string,saltRound:number=10):string{
return hashSync(plainText,saltRound)
}
export   function compare(plainText:string,hashtext:string):boolean{
    return compareSync(plainText,hashtext)
    }