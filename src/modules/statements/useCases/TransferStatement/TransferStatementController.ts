import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferStatementUseCase } from './TransferStatementUseCase';

export class TransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_recipient_id } = request.params;

    const transferStatement = container.resolve(TransferStatementUseCase);

    const statement = await transferStatement.execute({
      sender_id: user_id,
      user_id: user_recipient_id,
      description,
      amount
    });

    return response.status(201).json(statement);
  }
}
