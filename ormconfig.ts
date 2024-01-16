import * as dotenv from 'dotenv';

const developmentMode = process.env.NODE_ENV !== 'production';

if (developmentMode) {
    dotenv.config({
        path: '.env.development',
    });
}

const databaseSsl = process.env.DATABASE_SSL;
const config = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['src/**/*.entity{.ts,.js}'],
    ssl: !(
        databaseSsl === undefined ||
        databaseSsl === '' ||
        databaseSsl.toLowerCase() === 'false'
    ),
    autoLoadEntities: true,
    synchronize: developmentMode,
};

export default config;
