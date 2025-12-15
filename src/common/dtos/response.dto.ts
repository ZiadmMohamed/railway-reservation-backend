import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;
}
