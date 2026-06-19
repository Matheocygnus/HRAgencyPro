import { NotFoundException } from '@nestjs/common';
import { ContractsService } from './contracts.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

describe('ContractsService', () => {
  let service: ContractsService;
  let repo: ReturnType<typeof makeRepoMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    service = new ContractsService(repo as any);
  });

  describe('findAll', () => {
    it('returns an array of contracts', async () => {
      const contracts = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(contracts);
      await expect(service.findAll()).resolves.toEqual(contracts);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when contract does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the contract when found', async () => {
      const contract = { id: 1, title: 'Dev Contract' };
      repo.findOne.mockResolvedValue(contract);
      await expect(service.findOne(1)).resolves.toEqual(contract);
    });
  });

  describe('create', () => {
    it('saves and returns the new contract', async () => {
      const dto = { title: 'New Contract' } as any;
      repo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, title: 'Old Title' };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.update(1, { title: 'New Title' } as any);
      expect(result.title).toBe('New Title');
    });

    it('throws NotFoundException when contract does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the contract', async () => {
      const existing = { id: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('throws NotFoundException when contract does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
