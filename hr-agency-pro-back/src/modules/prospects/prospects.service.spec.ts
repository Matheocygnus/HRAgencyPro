import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ProspectsService } from './prospects.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
    update: jest.fn(),
  };
}

function makeDataSourceMock() {
  return {
    transaction: jest.fn(async (cb: any) => {
      const manager = {
        update: jest.fn(),
        create: jest.fn((_entity: any, dto: any) => ({ ...dto })),
        save: jest.fn(async (_entity: any, obj: any) => ({ id: 99, ...obj })),
      };
      return cb(manager);
    }),
  };
}

describe('ProspectsService', () => {
  let service: ProspectsService;
  let repo: ReturnType<typeof makeRepoMock>;
  let dataSource: ReturnType<typeof makeDataSourceMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    dataSource = makeDataSourceMock();
    service = new ProspectsService(repo as any, dataSource as any, {} as any);
  });

  describe('findAll', () => {
    it('returns an array of prospects', async () => {
      const prospects = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(prospects);
      await expect(service.findAll()).resolves.toEqual(prospects);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when prospect does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the prospect when found', async () => {
      const prospect = { id: 1, firstName: 'Alice', lastName: 'Smith' };
      repo.findOne.mockResolvedValue(prospect);
      await expect(service.findOne(1)).resolves.toEqual(prospect);
    });
  });

  describe('create', () => {
    it('saves and returns the new prospect', async () => {
      const dto = { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' } as any;
      repo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, firstName: 'Alice', lastName: 'Smith' };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.update(1, { firstName: 'Alice Updated' } as any);
      expect(result.firstName).toBe('Alice Updated');
    });

    it('throws NotFoundException when prospect does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the prospect', async () => {
      const existing = { id: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('throws NotFoundException when prospect does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('appendNote', () => {
    it('appends a note entry to notesHistory', async () => {
      const existing = { id: 1, notesHistory: [] };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.appendNote(1, 'great candidate');
      expect(result.notesHistory).toHaveLength(1);
      expect(result.notesHistory[0].note).toBe('great candidate');
    });
  });

  describe('promoteToHero', () => {
    it('throws NotFoundException when prospect does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.promoteToHero(999, {})).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when prospect is already hired', async () => {
      repo.findOne.mockResolvedValue({ id: 1, status: 'hired', clientId: 2, companyId: 3 });
      await expect(service.promoteToHero(1, {})).rejects.toThrow(ConflictException);
    });

    it('throws BadRequestException when clientId is missing', async () => {
      repo.findOne.mockResolvedValue({ id: 1, status: 'contract', clientId: null, companyId: 3 });
      await expect(service.promoteToHero(1, {})).rejects.toThrow(BadRequestException);
    });

    it('creates hero and updates prospect status in a transaction', async () => {
      const prospect = { id: 1, status: 'contract', clientId: 2, companyId: 3 };
      repo.findOne.mockResolvedValue(prospect);

      const result = await service.promoteToHero(1, { startDate: '2024-01-15' });

      expect(dataSource.transaction).toHaveBeenCalled();
      expect(result.hero).toMatchObject({ prospectId: 1, clientId: 2, companyId: 3 });
      expect(result.prospect.status).toBe('hired');
    });
  });
});
