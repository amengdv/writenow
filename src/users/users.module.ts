import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeService } from 'src/time/time.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule, AuthModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        PrismaService,
        TimeService,
    ],
    exports: [UsersService]
})
export class UsersModule {}
