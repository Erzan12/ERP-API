import { HttpService } from '@nestjs/axios';
export declare class SlackService {
    private readonly httpService;
    constructor(httpService: HttpService);
    notify(message: string): Promise<void>;
}
