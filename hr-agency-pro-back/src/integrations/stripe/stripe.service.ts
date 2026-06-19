import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripeClient: any = null;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (secretKey) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Stripe = require('stripe');
        this.stripeClient = new Stripe(secretKey, { apiVersion: '2025-05-28.basil' });
        this.logger.log('Stripe client initialized');
      } catch (err) {
        this.logger.warn('Stripe package unavailable — using mock mode');
      }
    } else {
      this.logger.warn(
        'STRIPE_SECRET_KEY not configured — running in mock mode',
      );
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<{ clientSecret: string }> {
    if (!this.stripeClient) {
      return { clientSecret: `mock_pi_${amount}_${currency}_secret` };
    }

    const intent = await this.stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
    });
    return { clientSecret: intent.client_secret };
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    if (!this.stripeClient) {
      return 'mock_status';
    }

    const intent =
      await this.stripeClient.paymentIntents.retrieve(paymentIntentId);
    return intent.status;
  }
}
