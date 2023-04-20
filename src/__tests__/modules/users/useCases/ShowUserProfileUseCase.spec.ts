import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "../../../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

describe('Show Profile User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show the profile', async () => {

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678'
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile.name).toBe(user.name);
    expect(profile.email).toBe(user.email);

  });

  it('should not be able to show the profile from non-existing user', async () => {
    expect(
      showUserProfileUseCase.execute(
        'non-existing-user-id'
      )
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
