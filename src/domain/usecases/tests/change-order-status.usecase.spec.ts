import { IOrderRepository } from '../../ports/order.repository';
import { OrderEntity, OrderItem, OrderStatus } from '../../models/order.entity';
import { CustomErrorException } from '../../exceptions/custom.error.exceptions';
import { ChangeOrderStatusUseCase } from '../change-order-status.usecase';

const baseOrder = OrderEntity.create(
  'order-1',
  'merchant-1',
  'customer@test.com',
  [new OrderItem('product-1', 2, 10)],
  OrderStatus.PENDING,
  new Date(),
);

const mockOrderRepo = {
  save: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn(),
  findMerchantEmail: jest.fn(),
} as unknown as IOrderRepository;

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('ChangeOrderStatusUseCase', () => {
  let useCase: ChangeOrderStatusUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ChangeOrderStatusUseCase(mockOrderRepo,mockEventEmitter);
  });

  it('doit passer de PENDING a PAID', async () => {
    const paidOrder = OrderEntity.create(
      baseOrder.id,
      baseOrder.merchantId,
      baseOrder.customerEmail,
      baseOrder.items,
      OrderStatus.PAID,
      baseOrder.createdAt,
    );
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(baseOrder);
    (mockOrderRepo.updateStatus as jest.Mock).mockResolvedValue(paidOrder);

    const result = await useCase.execute('order-1', OrderStatus.PAID);

    expect(result.status).toBe(OrderStatus.PAID);
    expect(mockOrderRepo.updateStatus).toHaveBeenCalledWith(
      'order-1',
      OrderStatus.PAID,
    );
  });

  it('doit passer de PAID a SHIPPED', async () => {
    const paidOrder = OrderEntity.create(
      baseOrder.id,
      baseOrder.merchantId,
      baseOrder.customerEmail,
      baseOrder.items,
      OrderStatus.PAID,
      baseOrder.createdAt,
    );
    const shippedOrder = OrderEntity.create(
      baseOrder.id,
      baseOrder.merchantId,
      baseOrder.customerEmail,
      baseOrder.items,
      OrderStatus.SHIPPED,
      baseOrder.createdAt,
    );
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(paidOrder);
    (mockOrderRepo.updateStatus as jest.Mock).mockResolvedValue(shippedOrder);

    const result = await useCase.execute('order-1', OrderStatus.SHIPPED);

    expect(result.status).toBe(OrderStatus.SHIPPED);
  });

  it('doit passer de PENDING a CANCELLED', async () => {
    const cancelledOrder = OrderEntity.create(
      baseOrder.id,
      baseOrder.merchantId,
      baseOrder.customerEmail,
      baseOrder.items,
      OrderStatus.CANCELLED,
      baseOrder.createdAt,
    );
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(baseOrder);
    (mockOrderRepo.updateStatus as jest.Mock).mockResolvedValue(cancelledOrder);

    const result = await useCase.execute('order-1', OrderStatus.CANCELLED);

    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('doit lever une erreur si la commande est introuvable', async () => {
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      useCase.execute('unknown-order', OrderStatus.PAID),
    ).rejects.toThrow(CustomErrorException);

    expect(mockOrderRepo.updateStatus).not.toHaveBeenCalled();
  });

  it('doit lever une erreur si la transition est invalide', async () => {
    const paidOrder = OrderEntity.create(
      baseOrder.id,
      baseOrder.merchantId,
      baseOrder.customerEmail,
      baseOrder.items,
      OrderStatus.PAID,
      baseOrder.createdAt,
    );
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(paidOrder);

    await expect(
      useCase.execute('order-1', OrderStatus.CANCELLED),
    ).rejects.toThrow(CustomErrorException);

    expect(mockOrderRepo.updateStatus).not.toHaveBeenCalled();
  });

  it('doit lever une erreur si le statut cible est identique', async () => {
    (mockOrderRepo.findById as jest.Mock).mockResolvedValue(baseOrder);

    await expect(
      useCase.execute('order-1', OrderStatus.PENDING),
    ).rejects.toThrow(CustomErrorException);

    expect(mockOrderRepo.updateStatus).not.toHaveBeenCalled();
  });
});