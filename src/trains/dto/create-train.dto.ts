import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateTrainDto {
  @ApiProperty({ example: 'Express Train' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'T12345' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ example: 'Boston' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: '100' })
  @IsNumberString()
  @IsNotEmpty()
  totalSeats: string;
}

