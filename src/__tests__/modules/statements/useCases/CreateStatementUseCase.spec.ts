import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { CreateStatementError } from "../../../../modules/statements/useCases/createStatement/CreateStatementError";

describe('Create Statement Use Case', () => {
  let statementsRepository: InMemoryStatementsRepository;
  let usersRepository: InMemoryUsersRepository;
  let createStatementUseCase: CreateStatementUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it('should be able success to deposit new statement', async () => {

      usersRepository.findById = jest.fn().mockResolvedValueOnce({ id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510' });

      const newStatement = await createStatementUseCase.execute({
        description: 'Deposito',
        type: 'deposit' as OperationType,
        amount: 500,
        user_id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510'
      });

      expect(newStatement).toHaveProperty('id');
  });

  it('should be error to create new statement when a non exist user', async () => {

    const dto = {
      description: 'Deposito',
      type: 'deposit' as OperationType,
      amount: 500,
      user_id: 'user-not-exists'
    }

    await expect(createStatementUseCase.execute(dto)).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should be error when withdrawing with insufficient balance ', async () => {

      usersRepository.findById = jest.fn().mockResolvedValueOnce({ id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510' });

      const dto = {
        description: 'Sacar',
        type: 'withdraw' as OperationType,
        amount: 500,
        user_id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510'
      }

      await expect(createStatementUseCase.execute(dto)).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
