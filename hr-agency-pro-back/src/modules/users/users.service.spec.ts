import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
    count: jest.fn(),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let repo: ReturnType<typeof makeRepoMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    service = new UsersService(repo as any);
  });

  describe('findAll', () => {
    it('returns an array of users', async () => {
      const users = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(users);
      await expect(service.findAll()).resolves.toEqual(users);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when user does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns user when found', async () => {
      const user = { id: 1, username: 'alice' };
      repo.findOne.mockResolvedValue(user);
      await expect(service.findOne(1)).resolves.toEqual(user);
    });
  });

  describe('create', () => {
    it('hashes the password before saving', async () => {
      const dto = {
        username: 'bob',
        email: 'bob@example.com',
        password: 'plaintext',
        firstName: 'Bob',
        lastName: 'Smith',
        roleId: 1,
      };

      let savedUser: any;
      repo.save.mockImplementation(async (u: any) => {
        savedUser = u;
        return u;
      });

      await service.create(dto);

      expect(savedUser).toBeDefined();
      expect(savedUser.password).toBeDefined();
      expect(savedUser.password).not.toBe('plaintext');
      expect(savedUser.password).toContain(':');
    });
  });

  describe('update', () => {
    it('re-hashes the password when dto.password is provided', async () => {
      const existing = {
        id: 1,
        username: 'alice',
        password: 'old-hash:abc',
      };
      repo.findOne.mockResolvedValue(existing);

      let savedUser: any;
      repo.save.mockImplementation(async (u: any) => {
        savedUser = u;
        return u;
      });

      await service.update(1, { password: 'newpassword' } as any);

      expect(savedUser.password).not.toBe('old-hash:abc');
      expect(savedUser.password).not.toBe('newpassword');
      expect(savedUser.password).toContain(':');
    });
  });
});
