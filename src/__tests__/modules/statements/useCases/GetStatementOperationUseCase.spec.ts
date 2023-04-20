import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { GetStatementOperationError } from "../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";

describe('Get Statment Operation Use Case', () => {
  let statementsRepository: InMemoryStatementsRepository;
  let usersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it('should be able show statement operation', async () => {
      const user_id = '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510';
      const statement_id = '3024d3af-de06-443e-b798-032e1777afe5';

      usersRepository.findById = jest.fn().mockResolvedValueOnce({ id: user_id });
      statementsRepository.findStatementOperation = jest.fn().mockResolvedValueOnce({ id: statement_id });

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id,
        statement_id
      });

      expect(statementOperation).toHaveProperty('id');
  });

  it('should be error when a non exist user', async () => {

    const statement_id = '3024d3af-de06-443e-b798-032e1777afe5';

    statementsRepository.findStatementOperation = jest.fn().mockResolvedValueOnce({ id: statement_id });

    const dto = { user_id: 'user-not-exists', statement_id }

    await expect(getStatementOperationUseCase.execute(dto)).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should be error when a non exist statement operation', async () => {

    const user_id = '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510';

    usersRepository.findById = jest.fn().mockResolvedValueOnce({ id: user_id });

    const dto = { user_id, statement_id: 'statement-operation-not-existes' }

    await expect(getStatementOperationUseCase.execute(dto)).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
