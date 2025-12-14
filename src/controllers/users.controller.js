import { userRepository } from "../repositories/user.repository.js";
import UserDTO from "../dto/user.dto.js";

export const registerUser = async (req, res, next) => {
  res.status(201).send({
    status: "success",
    message: "Usuario registrado correctamente",
    payload: req.user,
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userRepository.findAllUsers();
    const usersDTO = users.map((user) => new UserDTO(user));

    res.send({
      status: "success",
      payload: usersDTO,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const uid = req.params.uid;
  const { first_name, last_name, age } = req.body;

  try {
    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (age) updateData.age = age;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({
        status: "error",
        message: "No se proporcionaron datos para actualizar",
      });
    }

    const result = await userRepository.updateUser(uid, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const result = await userRepository.deleteUser(uid);

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.status(200).send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    next(error);
  }
};