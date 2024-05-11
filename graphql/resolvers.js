const User = require("../models/user");
const GRAPHQL_ERROR_MESSAGES = require("../messages/graphQlMessages");
const USER_ERROR_MESSAGES = require("../messages/userMessages");

const validateName = async (value) => {
  const nameRegex = /^[a-zA-Z\s]*$/;
  if (!nameRegex.test(value)) {
    return new Error(USER_ERROR_MESSAGES.INVALID_NAME);
  }
  return true;
};

const checkEmailFormat = async (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return new Error(USER_ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
  }

  return true;
};

const findSingleUserByEmail = async (value) => {
  const existingUser = await User.findOne({ email: value });
  if (existingUser) {
    return new Error(GRAPHQL_ERROR_MESSAGES.USER_EXISTS);
  }
  return true;
};

const validateEmail = async (value) => {
  await checkEmailFormat(value);
  await findSingleUserByEmail(value);
};

const createNewUser = async (name, email) => {
  const newUser = new User({ name, email });
  const savedUser = await newUser.save();
  return savedUser;
};

const resolvers = {
  Query: {
    getAllUsers: async () => {
      try {
        const users = await User.find();
        if (!users) {
          return new Error(GRAPHQL_ERROR_MESSAGES.USERS_NOT_FOUND);
        }
        return users;
      } catch (error) {
        return new Error(GRAPHQL_ERROR_MESSAGES.FETCH_UNABLED);
      }
    },
  },

  Mutation: {
    addUser: async (_, { name, email }) => {
      await validateName(name);
      await validateEmail(email);
      const newUser = await createNewUser(name, email);
      if (!newUser) {
        return new Error(GRAPHQL_ERROR_MESSAGES.ADD_USER_FAILED);
      }
      return newUser;
    },

    deleteUser: async (_, { id }) => {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return { success: false, error: GRAPHQL_ERROR_MESSAGES.USER_NOT_FOUND };
      }
      return { success: true };
    },
  },
};

module.exports = resolvers;
