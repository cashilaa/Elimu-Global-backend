import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  try {
    console.log('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:5000',                      // Local development
      'https://localhost:5000',                     // Local development with HTTPS
      'https://elimu-global-testing.onrender.com',      // Production frontend
      'http://elimu-global-testing.onrender.com'        // Production frontend without HTTPS
    ];

    console.log('Configuring CORS with allowed origins:', allowedOrigins);
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          console.warn(`Blocked request from unauthorized origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Access-Control-Allow-Credentials',
      exposedHeaders: 'Content-Range,X-Content-Range',
      maxAge: 3600
    });

    console.log('Setting up global pipes, filters, and interceptors...');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    console.log('Setting up Swagger documentation...');
    const config = new DocumentBuilder()
      .setTitle('Elimu Global API')
      .setDescription('The Elimu Global API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3001;
    
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('CORS configuration is active for the following origins:', allowedOrigins);

  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
