import { NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

function makeRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto: any) => ({ ...dto })),
    save: jest.fn(async (entity: any) => entity),
    remove: jest.fn(),
  };
}

function makeStripeMock() {
  return {
    createPaymentIntent: jest.fn(),
  };
}

describe('InvoicesService', () => {
  let service: InvoicesService;
  let repo: ReturnType<typeof makeRepoMock>;
  let stripe: ReturnType<typeof makeStripeMock>;

  beforeEach(() => {
    repo = makeRepoMock();
    stripe = makeStripeMock();
    service = new InvoicesService(repo as any, stripe as any);
  });

  describe('findAll', () => {
    it('returns an array of invoices', async () => {
      const invoices = [{ id: 1 }, { id: 2 }];
      repo.find.mockResolvedValue(invoices);
      await expect(service.findAll()).resolves.toEqual(invoices);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when invoice does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns the invoice when found', async () => {
      const invoice = { id: 1, amount: 500 };
      repo.findOne.mockResolvedValue(invoice);
      await expect(service.findOne(1)).resolves.toEqual(invoice);
    });
  });

  describe('create', () => {
    it('saves and returns the new invoice', async () => {
      const dto = { amount: 1000 } as any;
      repo.save.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toMatchObject(dto);
    });
  });

  describe('update', () => {
    it('merges dto and saves', async () => {
      const existing = { id: 1, amount: 100 };
      repo.findOne.mockResolvedValue(existing);
      repo.save.mockImplementation(async (e: any) => e);
      const result = await service.update(1, { amount: 200 } as any);
      expect(result.amount).toBe(200);
    });

    it('throws NotFoundException when invoice does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes the invoice', async () => {
      const existing = { id: 1 };
      repo.findOne.mockResolvedValue(existing);
      repo.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });
  });

  describe('createPaymentIntent', () => {
    it('calls StripeService with invoice amount and returns clientSecret', async () => {
      const invoice = { id: 1, amount: 300 };
      repo.findOne.mockResolvedValue(invoice);
      stripe.createPaymentIntent.mockResolvedValue({ clientSecret: 'pi_secret' });
      const result = await service.createPaymentIntent(1);
      expect(stripe.createPaymentIntent).toHaveBeenCalledWith(300, 'usd');
      expect(result).toEqual({ clientSecret: 'pi_secret' });
    });

    it('throws NotFoundException when invoice does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.createPaymentIntent(99)).rejects.toThrow(NotFoundException);
    });
  });
});
