import { NotFoundException } from '@nestjs/common';
import { InterviewsService } from './interviews.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

function makeTwilioMock() {
  return {
    generateVideoToken: jest.fn(),
  };
}

describe('InterviewsService', () => {
  let service: InterviewsService;
  let repo: ReturnType<typeof makeRepoMock>;
  let twilio: ReturnType<typeof makeTwilioMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    twilio = makeTwilioMock();
    service = new InterviewsService(repo as any, twilio as any);
  });

  describe('findAll', () => {
    it('returns an array of interviews', async () => {
      const interviews = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(interviews);
      await expect(service.findAll()).resolves.toEqual(interviews);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when interview does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the interview when found', async () => {
      const interview = { id: 1, scheduledAt: '2025-01-01' };
      repo.findOne.mockResolvedValue(interview);
      await expect(service.findOne(1)).resolves.toEqual(interview);
    });
  });

  describe('create', () => {
    it('saves and returns the new interview', async () => {
      const dto = { scheduledAt: '2025-06-01' } as any;
      repo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, scheduledDate: '2025-01-01' };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.update(1, { scheduledDate: '2025-02-01' } as any);
      expect(result.scheduledDate).toBe('2025-02-01');
    });

    it('throws NotFoundException when interview does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the interview', async () => {
      const existing = { id: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });
  });

  describe('generateVideoToken', () => {
    it('calls TwilioService with correct room name and identity', async () => {
      const interview = { id: 5 };
      repo.findOne.mockResolvedValue(interview);
      twilio.generateVideoToken.mockResolvedValue({ token: 'abc123' });
      const result = await service.generateVideoToken(5, 'alice');
      expect(twilio.generateVideoToken).toHaveBeenCalledWith('interview-5', 'alice');
      expect(result).toEqual({ token: 'abc123' });
    });

    it('throws NotFoundException when interview does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.generateVideoToken(99, 'alice')).rejects.toThrow(NotFoundException);
    });
  });
});
