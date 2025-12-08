import { JwtPayload } from './../../../../node_modules/@types/jsonwebtoken/index.d';
import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
@Injectable()
export class TokenService{
    constructor(private jwtservice:JwtService){}
    sign(payload:object,options:JwtSignOptions){
        return this.jwtservice.sign(payload,options)
    }

    verfiy(token:string,options:JwtVerifyOptions){
        return this.jwtservice.verify(token,options)
    }
}