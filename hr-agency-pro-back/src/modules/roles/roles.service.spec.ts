import { ConflictException, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';

function makeRoleRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

function makeUserRepoMock() {
  return {
    count: jest.fn(),
  };
}

describe('RolesService', () => {
  let service: RolesService;
  let roleRepo: ReturnType<typeof makeRoleRepoMock>;
  let userRepo: ReturnType<typeof makeUserRepoMock>;

  beforeEach(() => {
    roleRepo = makeRoleRepoMock();
    userRepo = makeUserRepoMock();
    service = new RolesService(roleRepo as any, userRepo as any);
  });

  describe('findAll', () => {
    it('returns all roles', async () => {
      roleRepo.find.mockResolvedValue([{ id: 1 }]);
      await expect(service.findAll()).resolves.toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when role not found', async () => {
      roleRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('persists a role with permissions array', async () => {
      const dto = {
        name: 'admin',
        permissions: ['users:read', 'roles:read'],
      };
      roleRepo.save.mockImplementation(async (r: any) => r);
      const result = await service.create(dto);
      expect(result.permissions).toEqual(['users:read', 'roles:read']);
    });
  });

  describe('remove', () => {
    it('throws ConflictException when users are assigned to the role', async () => {
      roleRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.count.mockResolvedValue(3);
      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });

    it('removes role when no users assigned', async () => {
      roleRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.count.mockResolvedValue(0);
      roleRepo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
