import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";
import { ITransferStatementDTO } from "./ITransferStatementDTO";

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, user_id, description, amount }: ITransferStatementDTO) {

    console.log(sender_id);
    console.log(user_id);
    console.log(description);
    console.log(amount);

    const [user_sender, user_repient ] = await Promise.all([
      this.usersRepository.findById(sender_id as string),
      this.usersRepository.findById(user_id)
    ])

    if(!user_sender) throw new TransferStatementError.UserSenderNotFound();
    if(!user_repient) throw new TransferStatementError.UserRecipientNotFound();

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id as string });

    if (balance < amount) throw new TransferStatementError.InsufficientFunds()

    const statementOperation = await this.statementsRepository.transfer({
      sender_id,
      user_id,
      description,
      amount
    });

    return statementOperation;
  }
}
