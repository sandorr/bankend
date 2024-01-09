import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as process from 'process';

import { AppModule } from './app.module';

const production = process.env.NODE_ENV === 'production';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            disableErrorMessages: production,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    await app.listen(3000);
}

bootstrap();
