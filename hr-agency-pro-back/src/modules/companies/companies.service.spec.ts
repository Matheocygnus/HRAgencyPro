import { ConflictException, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';

function makeClientRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

function makeCompanyRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
    count: jest.fn(),
  };
}

describe('CompaniesService', () => {
  let service: CompaniesService;
  let clientRepo: ReturnType<typeof makeClientRepoMock>;
  let companyRepo: ReturnType<typeof makeCompanyRepoMock>;

  beforeEach(() => {
    clientRepo = makeClientRepoMock();
    companyRepo = makeCompanyRepoMock();
    service = new CompaniesService(clientRepo as any, companyRepo as any);
  });

  // ---- Clients ----

  describe('findAllClients', () => {
    it('returns an array of clients', async () => {
      const clients = [{ id: 1 }, { id: 2 }];
      clientRepo.find.mockResolvedValue(clients);
      await expect(service.findAllClients()).resolves.toEqual(clients);
    });
  });

  describe('findOneClient', () => {
    it('throws NotFoundException when client does not exist', async () => {
      clientRepo.findOne.mockResolvedValue(null);
      await expect(service.findOneClient(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the client when found', async () => {
      const client = { id: 1, name: 'Acme' };
      clientRepo.findOne.mockResolvedValue(client);
      await expect(service.findOneClient(1)).resolves.toEqual(client);
    });
  });

  describe('createClient', () => {
    it('saves and returns the new client', async () => {
      const dto = { name: 'Globex' } as any;
      clientRepo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.createClient(dto);
      expect(clientRepo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('updateClient', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, name: 'Old Name' };
      clientRepo.findOne.mockResolvedValue(existing);
      clientRepo.save.mockImplementation(async (e: any) => e);
      const result = await service.updateClient(1, { name: 'New Name' } as any);
      expect(result.name).toBe('New Name');
    });

    it('throws NotFoundException when client does not exist', async () => {
      clientRepo.findOne.mockResolvedValue(null);
      await expect(service.updateClient(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeClient', () => {
    it('removes the client when no companies are associated', async () => {
      const existing = { id: 1 };
      clientRepo.findOne.mockResolvedValue(existing);
      companyRepo.count.mockResolvedValue(0);
      clientRepo.remove.mockResolvedValue(undefined);
      await expect(service.removeClient(1)).resolves.toBeUndefined();
      expect(clientRepo.remove).toHaveBeenCalledWith(existing);
    });

    it('throws ConflictException when associated companies exist', async () => {
      const existing = { id: 1 };
      clientRepo.findOne.mockResolvedValue(existing);
      companyRepo.count.mockResolvedValue(2);
      await expect(service.removeClient(1)).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when client does not exist', async () => {
      clientRepo.findOne.mockResolvedValue(null);
      await expect(service.removeClient(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ---- Companies ----

  describe('findAllCompanies', () => {
    it('returns an array of companies', async () => {
      const companies = [{ id: 1 }, { id: 2 }];
      companyRepo.find.mockResolvedValue(companies);
      await expect(service.findAllCompanies()).resolves.toEqual(companies);
    });
  });

  describe('findOneCompany', () => {
    it('throws NotFoundException when company does not exist', async () => {
      companyRepo.findOne.mockResolvedValue(null);
      await expect(service.findOneCompany(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the company when found', async () => {
      const company = { id: 1, name: 'TechCorp' };
      companyRepo.findOne.mockResolvedValue(company);
      await expect(service.findOneCompany(1)).resolves.toEqual(company);
    });
  });

  describe('createCompany', () => {
    it('saves and returns the new company', async () => {
      const dto = { name: 'Initech' } as any;
      companyRepo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.createCompany(dto);
      expect(companyRepo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('updateCompany', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, name: 'Old Corp' };
      companyRepo.findOne.mockResolvedValue(existing);
      companyRepo.save.mockImplementation(async (e: any) => e);
      const result = await service.updateCompany(1, { name: 'New Corp' } as any);
      expect(result.name).toBe('New Corp');
    });
  });

  describe('removeCompany', () => {
    it('removes the company', async () => {
      const existing = { id: 1 };
      companyRepo.findOne.mockResolvedValue(existing);
      companyRepo.remove.mockResolvedValue(undefined);
      await expect(service.removeCompany(1)).resolves.toBeUndefined();
      expect(companyRepo.remove).toHaveBeenCalledWith(existing);
    });
  });
});
