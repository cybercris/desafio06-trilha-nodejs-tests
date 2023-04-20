import { Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { ITransferStatementDTO } from "../../useCases/TransferStatement/ITransferStatementDTO";
import { IStatementsRepository } from "../IStatementsRepository";

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = [];

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(operation => (
      operation.id === statement_id &&
      operation.user_id === user_id
    ));
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = this.statements.filter(operation => operation.user_id === user_id || operation.sender_id === user_id);

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async transfer({ sender_id, user_id, description, amount }: ITransferStatementDTO): Promise<Statement>{
    const statement = Object.assign(new Statement, {
      id: '363d8872-8bff-4a1b-b1ef-fb8fd035beab',
      user_id,
      sender_id,
      description,
      type: 'transfer',
      amount,
      created_at: new Date('2021-03-26T21:33:11.370Z'),
      updated_at: new Date('2021-03-26T21:33:11.370Z')
     });

    this.statements.push(statement);

    return statement;
  }
}
