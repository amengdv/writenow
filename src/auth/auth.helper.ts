import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthHelper {

    async hashPassword(plainText: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(plainText, salt);
        return hash;
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    }

}
