import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private readonly from: string;
  private readonly rhRecipient: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('email.host');
    const port = this.configService.get<number>('email.port');
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.pass');

    this.from = this.configService.get<string>('email.from') ?? 'Remote Hero <noreply@remotehero.com>';
    this.rhRecipient = this.configService.get<string>('email.rhRecipient') ?? 'bruno@remotehero.com';

    if (host && user && pass) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport({ host, port: port ?? 587, auth: { user, pass } });
        this.logger.log('Email transporter initialized');
      } catch {
        this.logger.warn('Nodemailer unavailable — running in mock mode');
      }
    } else {
      this.logger.warn('Email credentials not configured — running in mock mode');
    }
  }

  async sendHeroRequestReceived(data: {
    id: number;
    clientName?: string;
    companyName?: string;
    title: string;
    openPositions?: number;
    startDate?: string;
    description: string;
    requirements: string;
    niceToHaveSkills?: string;
    tools?: string;
    jobType: string;
    workingHours?: string;
    timezone?: string;
    reportsTo?: string;
    languages?: string[];
    seniority?: string;
    notes?: string;
  }): Promise<void> {
    const subject = `[Remote Hero] New Hero Request — ${data.title}`;
    const html = `
      <h2>New Hero Request Received</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td><strong>Request ID</strong></td><td>#${data.id}</td></tr>
        <tr><td><strong>Client</strong></td><td>${data.clientName ?? '—'}</td></tr>
        <tr><td><strong>Company</strong></td><td>${data.companyName ?? '—'}</td></tr>
        <tr><td><strong>Role Title</strong></td><td>${data.title}</td></tr>
        ${data.openPositions ? `<tr><td><strong>Positions</strong></td><td>${data.openPositions}</td></tr>` : ''}
        ${data.startDate ? `<tr><td><strong>Start Date</strong></td><td>${data.startDate}</td></tr>` : ''}
        <tr><td><strong>Work Shift</strong></td><td>${data.jobType}</td></tr>
        ${data.workingHours ? `<tr><td><strong>Working Hours</strong></td><td>${data.workingHours}</td></tr>` : ''}
        ${data.timezone ? `<tr><td><strong>Time Zone</strong></td><td>${data.timezone}</td></tr>` : ''}
        ${data.seniority ? `<tr><td><strong>Seniority</strong></td><td>${data.seniority}</td></tr>` : ''}
        ${data.languages?.length ? `<tr><td><strong>Languages</strong></td><td>${data.languages.join(', ')}</td></tr>` : ''}
        <tr><td><strong>Responsibilities</strong></td><td>${data.description}</td></tr>
        <tr><td><strong>Must-have Skills</strong></td><td>${data.requirements}</td></tr>
        ${data.niceToHaveSkills ? `<tr><td><strong>Nice-to-have</strong></td><td>${data.niceToHaveSkills}</td></tr>` : ''}
        ${data.tools ? `<tr><td><strong>Tools</strong></td><td>${data.tools}</td></tr>` : ''}
        ${data.reportsTo ? `<tr><td><strong>Reports To</strong></td><td>${data.reportsTo}</td></tr>` : ''}
        ${data.notes ? `<tr><td><strong>Notes</strong></td><td>${data.notes}</td></tr>` : ''}
      </table>
    `;

    await this.send({ to: this.rhRecipient, subject, html });
  }

  async sendJobApplicationReceived(data: {
    id: number;
    applicantName: string;
    email: string;
    jobOpeningId?: number;
    role?: string;
    englishLevel?: string;
    seniority?: string;
    resumeUrl?: string;
    voiceMessageUrl?: string;
  }): Promise<void> {
    const subject = `[Remote Hero] New Application — ${data.applicantName}`;
    const html = `
      <h2>New Job Application Received</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td><strong>Application ID</strong></td><td>#${data.id}</td></tr>
        <tr><td><strong>Applicant</strong></td><td>${data.applicantName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
        ${data.role ? `<tr><td><strong>Position</strong></td><td>${data.role}</td></tr>` : ''}
        ${data.englishLevel ? `<tr><td><strong>English Level</strong></td><td>${data.englishLevel}</td></tr>` : ''}
        ${data.seniority ? `<tr><td><strong>Seniority</strong></td><td>${data.seniority}</td></tr>` : ''}
        ${data.resumeUrl ? `<tr><td><strong>Resume</strong></td><td>${data.resumeUrl}</td></tr>` : ''}
        ${data.voiceMessageUrl ? `<tr><td><strong>Voice Message</strong></td><td>${data.voiceMessageUrl}</td></tr>` : ''}
      </table>
    `;

    await this.send({ to: this.rhRecipient, subject, html });
  }

  async sendResumeToClient(data: {
    prospectId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    skills?: string;
    resumeUrl?: string;
    notes?: string;
  }): Promise<void> {
    const fullName = `${data.firstName} ${data.lastName}`;
    const subject = `[Remote Hero] Candidate Profile — ${fullName}`;
    const html = `
      <h2>Candidate Profile Ready for Review</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td><strong>Prospect ID</strong></td><td>#${data.prospectId}</td></tr>
        <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
        ${data.phone ? `<tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>` : ''}
        ${data.position ? `<tr><td><strong>Position</strong></td><td>${data.position}</td></tr>` : ''}
        ${data.skills ? `<tr><td><strong>Skills</strong></td><td>${data.skills}</td></tr>` : ''}
        ${data.resumeUrl ? `<tr><td><strong>Resume</strong></td><td><a href="${data.resumeUrl}">${data.resumeUrl}</a></td></tr>` : ''}
        ${data.notes ? `<tr><td><strong>Notes</strong></td><td>${data.notes}</td></tr>` : ''}
      </table>
    `;

    await this.send({ to: this.rhRecipient, subject, html });
  }

  private async send(options: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[MOCK EMAIL] To: ${options.to} | Subject: ${options.subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({ from: this.from, ...options });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${options.to}`, err);
    }
  }
}
