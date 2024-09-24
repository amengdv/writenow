import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import { TimeService } from 'src/time/time.service';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private authHelper: AuthHelper,
        private timeService: TimeService,
        private jwtService: JwtService,
    ) {}

    /**
     * @param {LoginUserDto} loginUserDto - email and password
     * @returns Auth and JWT Token
    */
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const userDb: User = await this.userService.user({
            email: loginUserDto.email,
        });

        try {
            await this.authHelper.comparePassword(loginUserDto.password, userDb?.password);
        } catch(err) {
            throw new UnauthorizedException();
        }

        const auth = await this.authService.createAuth({
            id: uuidv4(),
            createdAt: this.timeService.nowISO(new Date()),
            refreshToken: randomBytes(32).toString('hex'),
            user: {
                connect: {
                    id: userDb.id
                }
            },
        });

        // TODO: Issue a JWT Token
        const payload = { sub: userDb.id, username: userDb.username };
        const token = await this.jwtService.signAsync(payload)

        return {
            authentication_info: auth,
            access_token: token,
        }
    }
}
