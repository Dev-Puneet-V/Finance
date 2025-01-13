import User from "../models/user.js";

const createUser = async (name, email, password) => {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });
    return {
      id: newUser?._id,
      name,
      email,
    };
  } catch (error) {
    throw error;
  }
};


export { createUser };
