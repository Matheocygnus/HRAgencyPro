import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private twilioClient: any = null;
  private readonly accountSid: string | undefined;
  private readonly authToken: string | undefined;
  private readonly apiKeySid: string | undefined;
  private readonly apiKeySecret: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.apiKeySid = this.configService.get<string>('TWILIO_API_KEY_SID');
    this.apiKeySecret = this.configService.get<string>('TWILIO_API_KEY_SECRET');

    if (this.accountSid && this.authToken) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const twilio = require('twilio');
        this.twilioClient = twilio(this.accountSid, this.authToken);
        this.logger.log('Twilio client initialized');
      } catch (err) {
        this.logger.warn('Twilio package unavailable — using mock mode');
      }
    } else {
      this.logger.warn(
        'TWILIO_ACCOUNT_SID not configured — running in mock mode',
      );
    }
  }

  generateVideoToken(
    roomName: string,
    identity: string,
  ): { token: string } {
    if (!this.twilioClient || !this.apiKeySid || !this.apiKeySecret) {
      return { token: `mock-twilio-token-${identity}-${roomName}` };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { AccessToken } = require('twilio').jwt;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { VideoGrant } = require('twilio').jwt.AccessToken;

      const token = new AccessToken(
        this.accountSid!,
        this.apiKeySid,
        this.apiKeySecret,
        { identity },
      );
      const videoGrant = new VideoGrant({ room: roomName });
      token.addGrant(videoGrant);
      return { token: token.toJwt() };
    } catch {
      return { token: `mock-twilio-token-${identity}-${roomName}` };
    }
  }
}
