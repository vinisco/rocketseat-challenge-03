import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
      .createQueryBuilder("users")
      .where({ id: user_id })
      .leftJoinAndSelect("users.games", "games")
      .getOneOrFail();

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(
      "SELECT * FROM users ORDER BY first_name ASC "
    );
  }

  async findUserByFullName({
    first_name: firstName,
    last_name: lastName,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query(
      `SELECT * FROM users WHERE LOWER(first_name) = '${firstName.toLowerCase()}' AND LOWER(last_name) = '${lastName.toLowerCase()}' `
    );

    return users;
  }
}
