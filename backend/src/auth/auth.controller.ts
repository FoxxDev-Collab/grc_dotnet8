import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post("login")
    async login(
    @Body()
    loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post("register/admin")
    async registerAdmin(
    @Body()
    registerDto: RegisterDto) {
        return this.authService.registerAdmin(registerDto);
    }
    @Post("register/client")
    async registerClient(
    @Body()
    registerDto: RegisterDto) {
        return this.authService.registerClient(registerDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async getProfile(
    @Request()
    req) {
        return this.authService.getProfile(req.user);
    }
}
