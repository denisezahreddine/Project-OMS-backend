export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
  ) {}
}
export class OrderEntity {
  constructor(
    public readonly id: string | null,
    public readonly merchantId: string,
    public readonly customerEmail: string,
    public readonly totalAmount: number,
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
    public readonly items: OrderItem[],
  ) {}

  public canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  /**
   * Factory method corrigée
   * Note : On utilise les arguments directement passés à la fonction
   */
  static create(
    id: string | null,
    merchantId: string,
    customerEmail: string,
    items: OrderItem[],
    status: OrderStatus = OrderStatus.PENDING,
    createdAt: Date = new Date(),
  ): OrderEntity {
    // Calcul du total basé sur la classe OrderItem
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return new OrderEntity(
      id,
      merchantId,
      customerEmail,
      total,
      status,
      createdAt,
      items,
    );
  }
}
