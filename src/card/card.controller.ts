import { Body, Controller, Post, RawBody, Req, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
import { Request } from 'express';
import { CardDTO } from './dto/card.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('webhook')
  @SkipThrottle()
  @AllowAnonymous()
  async webhook(@Req() req: any, @RawBody() raw: Buffer) {
const sig = req.headers['stripe-signature'];
    
    const payload = raw || req.rawBody; 
    
    return this.cardService.webhook(sig, payload);
  }

  @Post()
  @UseGuards(AuthGuard )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add card successfully' })
  @ApiResponse({
    status: 201,
    description: 'Card added successfully',
  })
  async addCard(@Body() body: CardDTO) {
    const card = await this.cardService.addCard(body.userId);
  
    
    return {
      message: 'Card added successfully',
      data: card,
    };
  }
}
