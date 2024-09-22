import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {

    private date: Date;

    constructor(private user: UsersService) {
        this.date = new Date();
    };

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        const id: string = uuidv4();
        const createdTime: string = this.date.toISOString();
        const updatedTime: string = this.date.toISOString()
        try {
            const user: User = await this.user.createUser({
                id: id,
                createdAt: createdTime,
                updatedAt: updatedTime,
                email: createUserDto.email,
                username: createUserDto.username,
                password: createUserDto.password,
            });
            return user;
        } catch(err) {
            throw new HttpException(
                `Error Creating User: ${err}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: err,
                }
            );
        }
    }

}
