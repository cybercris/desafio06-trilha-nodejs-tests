import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { TransferStatementUseCase } from "../../../../modules/statements/useCases/TransferStatement/TransferStatementUseCase";
import { User } from "../../../../modules/users/entities/User";
import { ITransferStatementDTO } from "../../../../modules/statements/useCases/TransferStatement/ITransferStatementDTO";
import { TransferStatementError } from "../../../../modules/statements/useCases/TransferStatement/TransferStatementError";
import { Statement } from "../../../../modules/statements/entities/Statement";

describe('Transfer Statement Use Case', () => {
  let statementsRepository: InMemoryStatementsRepository;
  let usersRepository: InMemoryUsersRepository;
  let transferStatementUseCase: TransferStatementUseCase;
  let user_sender: User;
  let user_recipient: User;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer',
  }

  beforeEach(async () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    transferStatementUseCase = new TransferStatementUseCase(usersRepository, statementsRepository);

    user_sender = await usersRepository.create({
      name: ' John Doe 1',
      email: 'johndoe1@example.com',
      password: '123'
    });

    user_recipient = await  usersRepository.create({
      name: ' John Doe 2',
      email: 'johndoe2@example.com',
      password: '123'
    });

  });

  it('should be an error when transferring when the amount is greater than the balance', async () => {

    const dto: ITransferStatementDTO = {
      user_id: user_recipient.id as string,
      sender_id: user_sender.id,
      amount: 999,
      description: 'Tranferência'
    }

    await expect(transferStatementUseCase.execute(dto)).rejects.toBeInstanceOf(TransferStatementError.InsufficientFunds);

  });

  it('should be an error when transferring amount balance a non-existent user sender' , async () => {

    const dto: ITransferStatementDTO = {
      user_id: user_recipient.id as string,
      sender_id: 'non-exists-user-sender',
      amount: 999,
      description: 'Tranferência'
    }

    await expect(transferStatementUseCase.execute(dto)).rejects.toBeInstanceOf(TransferStatementError.UserSenderNotFound);
  });

  it('should be an error when transferring amount balance a non-existent user recipient', async () => {

    const dto: ITransferStatementDTO = {
      user_id: 'non-exists-user-recipient',
      sender_id: user_sender.id,
      amount: 999,
      description: 'Tranferência'
    }

    await expect(transferStatementUseCase.execute(dto)).rejects.toBeInstanceOf(TransferStatementError.UserRecipientNotFound);
  });

  it('should be success when transfer amount', async () => {
    const dto: ITransferStatementDTO = {
      user_id: user_recipient.id as string,
      sender_id: user_sender.id,
      description: 'Transferência de valor',
      amount: 999
    }

    const expectTransfer = {
      id: '363d8872-8bff-4a1b-b1ef-fb8fd035beab',
      user_id: user_recipient.id as string,
      sender_id: user_sender.id as string,
      amount: 999,
      description: 'Transferência de valor',
      type: 'transfer' as OperationType,
      created_at: new Date('2021-03-26T21:33:11.370Z'),
      updated_at: new Date('2021-03-26T21:33:11.370Z')
    }

    statementsRepository.getUserBalance = jest.fn().mockReturnValueOnce({
      balance: 5000
    });

    const newTransfer = await transferStatementUseCase.execute(dto);

    console.log(newTransfer);

    expect(newTransfer).toEqual(expectTransfer)
  })

});
