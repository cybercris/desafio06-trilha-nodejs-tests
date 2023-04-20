import { InMemoryUsersRepository } from '../../../../modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from '../../../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError';
import { CreateUserUseCase } from '../../../../modules/users/useCases/createUser/CreateUserUseCase';

describe('Authenticate User Use Case', () => {

  let usersersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersersRepository);
    createUserUseCase = new CreateUserUseCase(usersersRepository);
  });

  it('should be able to authenticate', async () => {

    const user = await createUserUseCase.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'A123456B'
    });

    const response = await authenticateUserUseCase.execute({
        email: user.email,
        password: 'A123456B'
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {

    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@example2.com',
        password: 'A123456B'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it('should not be able to authenticate with wrong password', async () => {

    await usersersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'A123456B'
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@example.com',
        password: 'A123456B2'
      })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

});
