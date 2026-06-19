import { NotFoundException } from '@nestjs/common';
import { HeroesService } from './heroes.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

describe('HeroesService', () => {
  let service: HeroesService;
  let repo: ReturnType<typeof makeRepoMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    service = new HeroesService(repo as any);
  });

  describe('findAll', () => {
    it('returns an array of heroes', async () => {
      const heroes = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(heroes);
      await expect(service.findAll()).resolves.toEqual(heroes);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when hero does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the hero when found', async () => {
      const hero = { id: 1, prospectId: 1, clientId: 1, companyId: 1 };
      repo.findOne.mockResolvedValue(hero);
      await expect(service.findOne(1)).resolves.toEqual(hero);
    });
  });

  describe('create', () => {
    it('saves and returns the new hero', async () => {
      const dto = { name: 'Diana' } as any;
      repo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, prospectId: 1, clientId: 10, companyId: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.update(1, { clientId: 99 } as any);
      expect(result.clientId).toBe(99);
    });

    it('throws NotFoundException when hero does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the hero', async () => {
      const existing = { id: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('throws NotFoundException when hero does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
