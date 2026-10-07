import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as MySQLStore from 'express-mysql-session'; 
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  const MySQLSession = MySQLStore(session);
  const sessionStore = new MySQLSession({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345Az!',
    database: 'dadlaga',
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore, 
      cookie: {
        maxAge: 1000 * 60 * 60, 
        sameSite: 'lax',
        secure: false, 
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3002);
}
bootstrap();
