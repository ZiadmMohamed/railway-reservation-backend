import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TicketIdDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ticketId: string;
}
