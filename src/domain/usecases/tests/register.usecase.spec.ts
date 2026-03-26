import { RegisterUseCase } from '../register.usecase';
import { MerchantPort } from '../../ports/merchant.port';
import { MerchantEntity, Role } from '../../models/merchant.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomErrorException } from '../../exceptions/custom.error.exceptions';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockMerchant = MerchantEntity.create(
  'merchant-123',
  'Alice',
  'alice@test.com',
  '$2b$10$hashedpassword',
  Role.MERCHANT,
  new Date(),
  new Date(),
);

const mockMerchantRepo = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
} as unknown as MerchantPort;

const mockEventEmitter = {
  emit: jest.fn(),
} as unknown as EventEmitter2;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    registerUseCase = new RegisterUseCase(mockMerchantRepo, mockEventEmitter);
  });

  // Test 1
  it('doit creer un merchant et emettre user.registered', async () => {
    (mockMerchantRepo.findByEmail as jest.Mock).mockResolvedValue(null);
    (mockMerchantRepo.save as jest.Mock).mockResolvedValue(mockMerchant);

    const result = await registerUseCase.execute(
      'alice@test.com',
      'Alice',
      'password123',
    );

    // Merchant bien créé
    expect(result.email).toBe('alice@test.com');
    expect(result.role).toBe(Role.MERCHANT);

    // Event bien émis
    expect(mockEventEmitter.emit).toHaveBeenCalledWith(
      'user.registered',
      expect.objectContaining({
        merchantId: 'merchant-123',
        email: 'alice@test.com',
      }),
    );
  });

  // Test 2
  it('doit lever une erreur si email deja utilise', async () => {
    (mockMerchantRepo.findByEmail as jest.Mock).mockResolvedValue(mockMerchant);

    await expect(
      registerUseCase.execute('alice@test.com', 'Alice', 'password123'),
    ).rejects.toThrow(CustomErrorException);

    // Event ne doit pas être émis
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  // Test 3
  it('ne doit pas emettre user.registered pour un admin', async () => {
    (mockMerchantRepo.findByEmail as jest.Mock).mockResolvedValue(null);
    (mockMerchantRepo.save as jest.Mock).mockResolvedValue({
      ...mockMerchant,
      role: Role.ADMIN,
    });

    await registerUseCase.execute(
      'admin@test.com',
      'Admin',
      'password123',
      Role.ADMIN,
    );

    // Event ne doit PAS être émis pour un admin
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });
});