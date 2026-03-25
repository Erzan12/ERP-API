import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SlackService {
  constructor(private readonly httpService: HttpService) {}

  async notify(message: string) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) return;

    await firstValueFrom(
      this.httpService.post(webhookUrl, {
        text: message,
      }),
    );
  }
}
