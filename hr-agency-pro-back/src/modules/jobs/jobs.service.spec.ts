import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

describe('JobsService', () => {
  let service: JobsService;
  let openingRepo: ReturnType<typeof makeRepoMock>;
  let requestRepo: ReturnType<typeof makeRepoMock>;
  let applicationRepo: ReturnType<typeof makeRepoMock>;

  const emailServiceMock = { sendJobApplicationReceived: jest.fn(), sendHeroRequestReceived: jest.fn() };
  const configServiceMock = { get: jest.fn().mockReturnValue('') };

  beforeEach(() => {
    openingRepo = makeRepoMock();
    requestRepo = makeRepoMock();
    applicationRepo = makeRepoMock();
    service = new JobsService(
      openingRepo as any,
      requestRepo as any,
      applicationRepo as any,
      emailServiceMock as any,
      configServiceMock as any,
    );
  });

  describe('createApplication', () => {
    it('creates a job application record (no auth required at service level)', async () => {
      const dto = {
        jobOpeningId: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-1234',
      };

      applicationRepo.save.mockImplementation(async (a: any) => ({
        id: 1,
        ...a,
      }));

      const result = await service.createApplication(dto);
      expect(result).toMatchObject({ firstName: 'Jane', lastName: 'Doe' });
    });
  });

  describe('findOneOpening', () => {
    it('throws NotFoundException when opening not found', async () => {
      openingRepo.findOne.mockResolvedValue(null);
      await expect(service.findOneOpening(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllApplications', () => {
    it('returns all applications', async () => {
      applicationRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      await expect(service.findAllApplications()).resolves.toHaveLength(2);
    });
  });
});
