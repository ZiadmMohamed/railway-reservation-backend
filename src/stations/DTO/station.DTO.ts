import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStationDto {
  @IsString()
  @IsNotEmpty({ message: 'Station English name is required.' })
  @MaxLength(100)
  @ApiProperty()
  stationEnglishName: string;

  @IsString()
  @IsNotEmpty({ message: 'Station Arabic name is required.' })
  @MaxLength(100)
  @ApiProperty()
  stationArabicName: string;
}
