import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CardDTO {
  @ApiProperty({description:'User Id'})
    @IsString()
    @IsNotEmpty()
  userId: string;
}