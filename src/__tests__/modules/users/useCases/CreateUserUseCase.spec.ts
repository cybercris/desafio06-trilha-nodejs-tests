import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";

describe('Create User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create new users', async () => {

      const user = await createUserUseCase.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'A123456B'
      });

      expect(user).toHaveProperty('id');
  });

  it('should not be able to create new users when email is already exists', async () => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'A123456B'
    };

    usersRepository.findByEmail = jest
      .fn()
      .mockResolvedValueOnce([
        { id: '8815a8ee-c1cf-4f8a-b9cd-3ba867f12510', email: user.email },
      ]);

    await expect(createUserUseCase.execute(user)).rejects.toEqual(
    new CreateUserError(),
  );
  });

});
