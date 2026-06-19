export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-access',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '8h',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    from: process.env.TWILIO_FROM || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  },
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'Remote Hero <noreply@remotehero.com>',
    rhRecipient: process.env.RH_RECIPIENT_EMAIL || 'matheo@cygnusdevs.com',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '',
});
