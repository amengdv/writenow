import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeService } from 'src/time/time.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        PrismaService,
        TimeService,
    ],
})
export class UsersModule {}
