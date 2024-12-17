import { Controller, Post, Body, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { ClientAuthService } from './client-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller("auth/client")
export class ClientAuthController {
    private readonly logger = new Logger("ClientAuthController");
    constructor(private readonly clientAuthService: ClientAuthService) { }
    @Post("login")
    async login(
    @Body()
    loginDto: LoginDto) {
        this.logger.log("Login attempt", {
            email: loginDto.email
        });
        const result = await this.clientAuthService.login(loginDto);
        this.logger.log("Login successful", {
            userId: result.user.id,
            organizationId: result.user.organizationId
        });
        return result;
    }
    @Post("register")
    async register(
    @Body()
    registerDto: RegisterDto) {
        this.logger.log("Registration attempt", {
            email: registerDto.email
        });
        const result = await this.clientAuthService.register(registerDto);
        this.logger.log("Registration successful", {
            userId: result.user.id,
            organizationId: result.user.organization?.id
        });
        return result;
    }
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async getProfile(
    @Request()
    req) {
        this.logger.log("Profile request", {
            userId: req.user.id
        });
        const result = await this.clientAuthService.getProfile(req.user);
        this.logger.log("Profile retrieved", {
            userId: result.id,
            organizationId: result.organization?.id
        });
        return result;
    }
}
