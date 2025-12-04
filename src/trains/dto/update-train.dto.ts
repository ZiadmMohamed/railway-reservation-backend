import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UpdateTrainDto {
  @ApiProperty({ example: 'Express Train', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'T12345', required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ example: 'Boston', required: false })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({ example: '100', required: false })
  @IsNumberString()
  @IsOptional()
  totalSeats?: string;
}
