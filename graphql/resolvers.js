const User = require("../models/user");
const GRAPHQL_ERROR_MESSAGES = require("../messages/graphQlMessages");
const USER_ERROR_MESSAGES = require("../messages/userMessages");

const validateName = async (value) => {
  if (!/^[a-zA-Z\s]*$/.test(value)) {
    return false;
  }
  return true;
};

const checkEmailFormat = async (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return false;
  }
  return true;
};

const findSingleUserByEmail = async (value) => {
  return await User.find({ email: value });
};

const validateEmail = async (value) => {
  const emailFormat = await checkEmailFormat(value);
  if (!emailFormat) {
    return new Error(USER_ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
  }
  const existingUser = await findSingleUserByEmail(value);
  if (existingUser) {
    return new Error(GRAPHQL_ERROR_MESSAGES.USER_EXISTS);
  }
  return true;
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

    getSingleUser: async (_, { email }) => {
      const existingUser = await findSingleUserByEmail(email);
      if (!existingUser) {
        return new Error(GRAPHQL_ERROR_MESSAGES.USERS_NOT_FOUND);
      }
      return existingUser;
    },
  },

  Mutation: {
    addUser: async (_, { name, email }) => {
      const nameFormat = await validateName(name);
      if (!nameFormat) {
        return new Error(USER_ERROR_MESSAGES.INVALID_NAME);
      }
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
