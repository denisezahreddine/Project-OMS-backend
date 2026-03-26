import { WorkflowEngineUsecase } from './workflow-engine.usecase';
import { WorkflowRepository, WorkflowData } from '../ports/workflow.repository';
import { ActionFactory } from '../../infrastructure/workflow-engine/action-factory.service';
import { ActionHandler, ActionContext } from '../ports/action-handler.port';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockWorkflow: WorkflowData = {
  id: 'workflow-123',
  name: 'Test Workflow',
  trigger: 'user.registered',
  isActive: true,
  merchantId: 'merchant-123',
  actions: [
    { id: 'action-1', type: 'notify_admin', order: 1 },
    { id: 'action-2', type: 'create_log', order: 2 },
  ],
};

const mockWorkflowRepo = {
  findByTrigger: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  addAction: jest.fn(),
  findByMerchant: jest.fn(),
  saveExecution: jest.fn(),
  findExecutions: jest.fn(),
} as unknown as WorkflowRepository;

const mockHandler: ActionHandler = {
  execute: jest.fn().mockResolvedValue(undefined),
};

const mockActionFactory = {
  getHandler: jest.fn().mockReturnValue(mockHandler),
} as unknown as ActionFactory;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('WorkflowEngineUsecase', () => {
  let engine: WorkflowEngineUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new WorkflowEngineUsecase(mockWorkflowRepo, mockActionFactory);
  });

  // Test 1
  it('doit executer les actions quand un workflow actif correspond au trigger', async () => {
    (mockWorkflowRepo.findByTrigger as jest.Mock).mockResolvedValue([
      mockWorkflow,
    ]);
    (mockWorkflowRepo.saveExecution as jest.Mock).mockResolvedValue({});

    await engine.dispatch('user.registered', 'merchant-123', {
      email: 'test@test.com',
    });

    // Le factory doit être appelé pour chaque action
    expect(mockActionFactory.getHandler).toHaveBeenCalledWith('notify_admin');
    expect(mockActionFactory.getHandler).toHaveBeenCalledWith('create_log');

    // Le handler doit être exécuté 2 fois
    expect(mockHandler.execute).toHaveBeenCalledTimes(2);

    // L'exécution doit être sauvegardée
    expect(mockWorkflowRepo.saveExecution).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowId: 'workflow-123',
        status: 'success',
      }),
    );
  });

  // Test 2
  it('ne doit rien executer si aucun workflow ne correspond au trigger', async () => {
    (mockWorkflowRepo.findByTrigger as jest.Mock).mockResolvedValue([]);

    await engine.dispatch('user.registered', 'merchant-123', {});

    expect(mockHandler.execute).not.toHaveBeenCalled();
    expect(mockWorkflowRepo.saveExecution).not.toHaveBeenCalled();
  });

  // Test 3
  it('doit sauvegarder status error si une action echoue', async () => {
    (mockWorkflowRepo.findByTrigger as jest.Mock).mockResolvedValue([
      mockWorkflow,
    ]);
    (mockWorkflowRepo.saveExecution as jest.Mock).mockResolvedValue({});

    // Le handler va lancer une erreur
    (mockHandler.execute as jest.Mock).mockRejectedValueOnce(
      new Error('Action failed'),
    );

    await engine.dispatch('user.registered', 'merchant-123', {});

    expect(mockWorkflowRepo.saveExecution).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
      }),
    );
  });
});