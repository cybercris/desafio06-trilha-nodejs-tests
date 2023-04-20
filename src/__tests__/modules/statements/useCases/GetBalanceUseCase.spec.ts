import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { GetBalanceError } from "../../../../modules/statements/useCases/getBalance/GetBalanceError";

describe('Get Balance Use Case', () => {
  let statementsRepository: InMemoryStatementsRepository;
  let usersRepository: InMemoryUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it('should be able show balance', async () => {

      usersRepository.findById = jest.fn().mockResolvedValueOnce({ id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510' });
      const dto = {
        balance: 1000,
        statement: [
          { id: '5e71953b-2a7b-4511-b5a0-26776c708e9f' },
          { id: 'b9aa65fc-9b9a-43cd-8bd4-54698c5a7665' },
        ]
      }
      statementsRepository.getUserBalance = jest.fn().mockResolvedValueOnce(dto);

      const balance = await getBalanceUseCase.execute({
        user_id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510'
      });

      expect(balance).toHaveProperty('balance');
      expect(balance).toEqual(dto);
  });

  it('should be error when a non exist user', async () => {

    const dto = { user_id: 'user-not-exists' }

    await expect(getBalanceUseCase.execute(dto)).rejects.toBeInstanceOf(GetBalanceError);
  });
});
