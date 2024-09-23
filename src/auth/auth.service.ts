import { Injectable } from '@nestjs/common';
import { Prisma, Auth } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async createAuth(data: Prisma.AuthCreateInput): Promise<Auth> {
        return this.prismaService.auth.create(
            {
                data: data,
            }
        );
    }
}
