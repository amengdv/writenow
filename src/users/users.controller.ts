import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TimeService } from 'src/time/time.service';
import { AuthHelper } from 'src/auth/auth.helper';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {

    constructor(
        private user: UsersService,
        private time: TimeService,
        private auth: AuthHelper,
    ) {};

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const id: string = uuidv4();
        const user: User = await this.user.createUser({
            id: id,
            createdAt: this.time.nowISO(new Date()),
            updatedAt: this.time.nowISO(new Date()),
            email: createUserDto.email,
            username: createUserDto.username,
            password: await this.auth.hashPassword(createUserDto.password),
        });

        return {
            id: user.id,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            email: user.email,
            username: user.username
        }
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOneById(@Param('id') id: any, @Request() req: any) {
        if (req.user.sub != id) {
            throw new UnauthorizedException();
        }

        const user = await this.user.user({
            id: id,
        });

        return {
            id: user.id,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            email: user.email,
            username: user.username,
        }
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateUserById(
        @Param('id') id: any,
        @Body() updateUserDto: CreateUserDto,
        @Request() req: any,
    ) {
        if (req.user.sub != id) {
            throw new UnauthorizedException();
        }

        const userUpdated = await this.user.updateUser({
            where: {
                id: id,
            },
            data: {
                email: updateUserDto.email,
                updatedAt: this.time.nowISO(new Date()),
                username: updateUserDto.username,
                password: await this.auth.hashPassword(updateUserDto.password),
            }
        });

        return {
            id: userUpdated.id,
            created_at: userUpdated.createdAt,
            updated_at: userUpdated.updatedAt,
            email: userUpdated.email,
            username: userUpdated.username,
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteUserById(
        @Param('id') id: any,
        @Request() req: any,
    ) {
        if (req.user.sub != id) {
            throw new UnauthorizedException();
        }

        await this.user.deleteUser(
            {
                id: id
            },
        )
    }
}
