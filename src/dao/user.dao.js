import UserModel from "./models/user.model.js";

class UserDao {
  async findUser(criteria) {
    return UserModel.findOne(criteria).lean();
  }

  async findUserById(id) {
    return UserModel.findById(id).lean();
  }

  async createUser(userData) {
    return UserModel.create(userData);
  }

  async updateOne(id, data) {
    return UserModel.updateOne({ _id: id }, { $set: data });
  }

  async updateByCriteria(criteria, data) {
    return UserModel.updateOne(criteria, { $set: data });
  }

  async findAll() {
    return UserModel.find().lean();
  }

  async deleteOne(id) {
    return UserModel.deleteOne({ _id: id });
  }
}

export default new UserDao();
