import UserDao from "../dao/user.dao.js";
import UserDTO from "../dto/user.dto.js";
import { createHash } from "../utils/hash.utils.js";

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async findByEmail(email) {
    return this.dao.findUser({ email });
  }

  async findById(id) {
    const user = await this.dao.findUserById(id);
    if (!user) return null;
    return user;
  }

  async registerUser(userData) {
    userData.password = createHash(userData.password);
    const newUser = await this.dao.createUser(userData);
    return new UserDTO(newUser);
  }

  async getCurrentUser(id) {
    const user = await this.dao.findUserById(id);
    if (!user) return null;

    return new UserDTO(user);
  }

  async updatePassword(email, newPassword) {
    const hashedPassword = createHash(newPassword);

    return this.dao.updateByCriteria(
      { email },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    );
  }

  async saveResetToken(email, token, expiration) {
    return this.dao.updateByCriteria(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiration,
      }
    );
  }

  async findByResetToken(token) {
    return this.dao.findUser({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  async findAllUsers() {
    return this.dao.findAll();
  }

  async updateUser(id, data) {
    return this.dao.updateOne(id, data);
  }

  async deleteUser(id) {
    return this.dao.deleteOne(id);
  }
}

export const userRepository = new UserRepository(UserDao);
