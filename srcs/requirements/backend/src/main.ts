import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { createServer } from 'http';

// class CustomSocketIoAdapter extends IoAdapter {
//   createIOServer(port: number, options?: ServerOptions): any {
//     const server = super.createIOServer(port, options);

//     server.use((socket: any, next: any) => {
//       const allowedOrigins = ['http://localhost:3000'];
//       const origin = socket.handshake.headers.origin;
//       if (allowedOrigins.includes(origin)) {
//         return next();
//       }
//       return next(new Error('Not allowed by CORS'));
//     });

//     return server;
//   }
// }

async function bootstrap() {

  // server.listen(5000);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // protect against data not set in the DTO

  // app.useWebSocketAdapter(new CustomSocketIoAdapter(app));


  await app.listen(5000);
}

bootstrap();
