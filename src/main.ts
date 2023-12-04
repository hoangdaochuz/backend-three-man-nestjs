import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Three man API')
    .setDescription('This is api docucment of three man project')
    .setVersion('0.1')
    .build();
  const docucment = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, docucment);
  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors();
  await app.listen(8080); // run on port 8080
}
bootstrap();
