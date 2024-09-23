import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TimeService } from 'src/time/time.service';
import { AuthHelper } from 'src/auth/auth.helper';

@Controller('users')
export class UsersController {


    constructor(
        private user: UsersService,
        private time: TimeService,
        private auth: AuthHelper,
    ) {};

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        const id: string = uuidv4();
        try {
            const user: User = await this.user.createUser({
                id: id,
                createdAt: this.time.nowISO(new Date()),
                updatedAt: this.time.nowISO(new Date()),
                email: createUserDto.email,
                username: createUserDto.username,
                password: await this.auth.hashPassword(createUserDto.password),
            });
            return user;
        } catch(err) {
            throw new HttpException(
                'Error Creating User',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: err,
                }
            );
        }
    }


}
