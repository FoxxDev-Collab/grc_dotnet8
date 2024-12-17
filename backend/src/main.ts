import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS with explicit headers
    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        exposedHeaders: ["Authorization"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    // Security middleware with relaxed CSP for development
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    }));
    app.use(compression());
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    // Global prefix for all routes
    app.setGlobalPrefix("api");
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
