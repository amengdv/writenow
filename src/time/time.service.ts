import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
    /**
     * Get current local time in ISO Format
     * @param {Date} date 
     * @returns {string}
    */
    nowISO(date: Date): string {
        const offset: number = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() - offset);
        return localTime.toISOString();
    }
}
