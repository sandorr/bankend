import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from './accounts/account.entity';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.local'],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const databaseSsl = configService.get('DATABASE_SSL');

                return {
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    ssl: !(
                        databaseSsl === undefined ||
                        databaseSsl === '' ||
                        databaseSsl === 'false'
                    ),
                    entities: [User, Account],
                    synchronize:
                        configService.get('NODE_ENV') === 'development',
                };
            },
        }),
        AccountsModule,
        TransfersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
