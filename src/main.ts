import 'cross-fetch/polyfill';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as dns from 'dns';

// Configure DNS resolution
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Enable CORS with environment variables
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://elimu-global-testing.onrender.com',
      'http://localhost:5173'
    ];

    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Enable validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    const port = process.env.PORT || 3001;
    
    // Global error handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
    });

    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log('Allowed CORS origins:', allowedOrigins);

    // Test DNS resolution
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const hostname = new URL(supabaseUrl).hostname;
      const addresses = await dns.promises.resolve4(hostname);
      logger.log(`Supabase DNS resolution successful. IP addresses: ${addresses.join(', ')}`);
    } catch (error) {
      logger.error('DNS resolution failed:', error);
    }
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap application:', error);
  process.exit(1);
});
