import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { JobOpening } from './entities/job-opening.entity';
import { JobRequest } from './entities/job-request.entity';
import { JobApplication } from './entities/job-application.entity';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { UpdateJobOpeningDto } from './dto/update-job-opening.dto';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { UpdateJobRequestDto } from './dto/update-job-request.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { EmailService } from '../../integrations/email/email.service';

export interface GeneratedJobPost {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salary: string;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(JobOpening)
    private readonly jobOpeningRepository: Repository<JobOpening>,
    @InjectRepository(JobRequest)
    private readonly jobRequestRepository: Repository<JobRequest>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // ---- Gemini diagnostics ----

  async geminiStatus(): Promise<{ configured: boolean; keyPrefix: string; testResult?: string; error?: string }> {
    const apiKey = this.configService.get<string>('gemini.apiKey');
    if (!apiKey) {
      return { configured: false, keyPrefix: 'none', error: 'GEMINI_API_KEY is not set' };
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent('Say "Gemini OK" and nothing else.');
      return { configured: true, keyPrefix: apiKey.slice(0, 8) + '...', testResult: result.response.text().trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { configured: true, keyPrefix: apiKey.slice(0, 8) + '...', error: message };
    }
  }

  // ---- Job Openings ----

  findAllOpenings(): Promise<JobOpening[]> {
    return this.jobOpeningRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneOpening(id: number): Promise<JobOpening> {
    const opening = await this.jobOpeningRepository.findOne({ where: { id } });
    if (!opening) throw new NotFoundException(`JobOpening #${id} not found`);
    return opening;
  }

  async createOpening(dto: CreateJobOpeningDto): Promise<JobOpening> {
    const { salaryRange, status, ...rest } = dto as any;
    const opening = this.jobOpeningRepository.create({
      ...rest,
      description: rest.description ?? '',
      requirements: rest.requirements ?? '',
      location: rest.location ?? '',
      jobType: rest.jobType ?? '',
      ...(salaryRange !== undefined ? { salary: salaryRange } : {}),
      ...(status !== undefined ? { isActive: status === 'active' } : {}),
    } as JobOpening);
    return this.jobOpeningRepository.save(opening);
  }

  async updateOpening(
    id: number,
    dto: UpdateJobOpeningDto,
  ): Promise<JobOpening> {
    const opening = await this.findOneOpening(id);
    const { salaryRange, status, ...rest } = dto as any;
    Object.assign(opening, rest);
    if (salaryRange !== undefined) opening.salary = salaryRange;
    if (status !== undefined) opening.isActive = status === 'active';
    return this.jobOpeningRepository.save(opening);
  }

  async removeOpening(id: number): Promise<void> {
    const opening = await this.findOneOpening(id);
    await this.jobOpeningRepository.remove(opening);
  }

  // ---- Job Requests ----

  findAllRequests(clientId?: number): Promise<JobRequest[]> {
    return this.jobRequestRepository.find({
      ...(clientId ? { where: { clientId } } : {}),
      order: { createdAt: 'DESC' },
    });
  }

  async findOneRequest(id: number): Promise<JobRequest> {
    const request = await this.jobRequestRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException(`JobRequest #${id} not found`);
    return request;
  }

  async createRequest(dto: CreateJobRequestDto): Promise<JobRequest> {
    const request = this.jobRequestRepository.create(dto);
    const saved = await this.jobRequestRepository.save(request);
    void this.emailService.sendHeroRequestReceived(saved);
    return saved;
  }

  async updateRequest(
    id: number,
    dto: UpdateJobRequestDto,
  ): Promise<JobRequest> {
    const request = await this.findOneRequest(id);
    Object.assign(request, dto);
    return this.jobRequestRepository.save(request);
  }

  async removeRequest(id: number): Promise<void> {
    const request = await this.findOneRequest(id);
    await this.jobRequestRepository.remove(request);
  }

  async cancelRequest(id: number, clientId: number): Promise<void> {
    const request = await this.findOneRequest(id);
    if (request.clientId !== clientId) {
      throw new ForbiddenException('You do not have permission to cancel this request');
    }
    if (request.status !== 'pending') {
      throw new ForbiddenException('Only pending requests can be cancelled');
    }
    await this.jobRequestRepository.remove(request);
  }

  async resubmitRequest(id: number, clientId: number, dto: UpdateJobRequestDto): Promise<JobRequest> {
    const request = await this.findOneRequest(id);
    if (request.clientId !== clientId) {
      throw new ForbiddenException('You do not have permission to resubmit this request');
    }
    if (request.status !== 'rejected') {
      throw new ForbiddenException('Only rejected requests can be resubmitted');
    }
    Object.assign(request, dto, { status: 'pending' });
    return this.jobRequestRepository.save(request);
  }

  // ---- Job Applications ----

  findAllApplications(): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find();
  }

  async findOneApplication(id: number): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id },
    });
    if (!application)
      throw new NotFoundException(`JobApplication #${id} not found`);
    return application;
  }

  async createApplication(
    dto: CreateJobApplicationDto,
    resumeUrl?: string,
    voiceMessageUrl?: string,
  ): Promise<JobApplication> {
    const application = this.jobApplicationRepository.create({
      ...dto,
      resumeUrl,
      voiceMessageUrl,
    });
    const saved = await this.jobApplicationRepository.save(application);
    void this.emailService.sendJobApplicationReceived({
      id: saved.id,
      applicantName: `${dto.firstName} ${dto.lastName}`.trim() || 'Unknown',
      email: dto.email,
      jobOpeningId: dto.jobOpeningId,
      role: dto.role ?? '',
      englishLevel: dto.englishLevel,
      seniority: dto.seniority,
      resumeUrl,
      voiceMessageUrl,
    });
    return saved;
  }

  async updateApplication(
    id: number,
    dto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    const application = await this.findOneApplication(id);
    Object.assign(application, dto);
    return this.jobApplicationRepository.save(application);
  }

  async removeApplication(id: number): Promise<void> {
    const application = await this.findOneApplication(id);
    await this.jobApplicationRepository.remove(application);
  }

  // ---- AI Job Generation ----

  async generateFromRequest(requestId: number): Promise<GeneratedJobPost> {
    const request = await this.findOneRequest(requestId);
    const apiKey = this.configService.get<string>('gemini.apiKey');

    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not set — returning mock job post');
      return this.mockJobPost(request);
    }

    const prompt = `
You are a professional recruiter at Remote Hero, a staffing agency that connects Latin American talent with international companies.

Write an attractive, professional job posting in English based on the following client request:

Role: ${request.title}
Description: ${request.description}
Requirements: ${request.requirements}
${request.niceToHaveSkills ? `Nice-to-have: ${request.niceToHaveSkills}` : ''}
Work Shift: ${request.jobType}
${request.workingHours ? `Working Hours: ${request.workingHours}` : ''}
${request.location ? `Time Zone: ${request.location}` : ''}
${request.seniority ? `Seniority: ${request.seniority}` : ''}
${request.notes ? `Additional context: ${request.notes}` : ''}

Return a JSON object with exactly these fields:
{
  "title": "attractive job title (max 60 chars)",
  "description": "compelling 2-3 paragraph job description highlighting the opportunity, company culture, and impact",
  "requirements": "bullet-point list of must-have and nice-to-have skills",
  "location": "location string",
  "jobType": "job type string",
  "salary": "salary range or exact amount as string"
}

Return ONLY the JSON, no markdown, no explanation.
    `.trim();

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text: string = result.response.text().trim();
      const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(clean) as GeneratedJobPost;
    } catch (err) {
      this.logger.error('Gemini generation failed', err);
      return this.mockJobPost(request);
    }
  }

  async enhanceFromRequest(requestId: number): Promise<{ enhancedText: string; debug?: string }> {
    const request = await this.findOneRequest(requestId);
    const apiKey = this.configService.get<string>('gemini.apiKey');

    this.logger.log(`[enhance] requestId=${requestId} apiKey=${apiKey ? `set (${apiKey.slice(0, 6)}...)` : 'MISSING'}`);

    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured — returning raw fallback');
      return {
        enhancedText: `# ${request.title}\n\n${request.description ?? ''}\n\n## Requirements\n${request.requirements ?? ''}`,
        debug: 'GEMINI_API_KEY is not set in environment',
      };
    }

    const budget = request.notes ?? 'Competitive — details shared during the interview process';
    const startDate = request.startDate ?? 'To be defined';
    const goodToHave = request.niceToHaveSkills ?? 'Not specified';

    const prompt = `Actúa como un Tech Recruiter Senior y un Copywriter experto en reclutamiento B2B.
Tu tarea es tomar los datos crudos de una solicitud de empleo enviada por un cliente y transformarlos en una oferta de trabajo altamente atractiva, persuasiva y profesional.

Reglas de redacción:
- Usa un tono moderno, entusiasta y humano.
- Utiliza emojis estratégicos para hacer la lectura ágil, pero mantén la profesionalidad.
- Devuelve la respuesta estrictamente en formato Markdown limpio.
- NO incluyas saludos, introducciones tuyas ni texto extra. Devuelve ÚNICAMENTE el contenido listo para ser publicado.

Estructura obligatoria de la oferta:
1. Título Atractivo: Basado en el rol solicitado.
2. El Gancho (Hook): Un párrafo corto (2-3 líneas) que enamore al candidato y explique el impacto del rol.
3. Tus Responsabilidades: Viñetas claras sobre el día a día.
4. Lo que buscamos en ti: Separando claramente los requisitos excluyentes (Must-have) de los deseables (Good-to-have).
5. Nuestra Propuesta: Incluye el presupuesto (Budget) de forma transparente y atractiva.

Datos crudos del cliente a procesar:
Título del Rol: ${request.title}
Presupuesto Mensual: ${budget}
Fecha de Inicio Estimada: ${startDate}
Responsabilidades: ${request.description ?? ''}
Requisitos Excluyentes: ${request.requirements ?? ''}
Requisitos Deseables: ${goodToHave}`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return { enhancedText: result.response.text().trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Gemini enhancement failed: ${message}`, err);
      return {
        enhancedText: `# ${request.title}\n\n${request.description ?? ''}\n\n## Requirements\n${request.requirements ?? ''}`,
        debug: `Gemini call failed: ${message}`,
      };
    }
  }

  private mockJobPost(request: JobRequest): GeneratedJobPost {
    return {
      title: request.title,
      description: `We are looking for a talented ${request.title} to join our remote team.\n\n${request.description}`,
      requirements: request.requirements,
      location: request.location ?? 'Remote',
      jobType: request.jobType,
      salary: 'Competitive',
    };
  }
}
