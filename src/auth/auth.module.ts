import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthHelper } from './auth.helper';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthHelper,
        PrismaService,
    ],
    exports: [
        AuthHelper
    ],
})
export class AuthModule {}
