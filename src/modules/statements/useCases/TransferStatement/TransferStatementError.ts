import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class UserSenderNotFound extends AppError {
    constructor() {
      super('User sender not found', 404);
    }
  }

  export class UserRecipientNotFound extends AppError {
    constructor() {
      super('User recipient not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
