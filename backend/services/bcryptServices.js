import bcrypt from "bcrypt";

const comparePassword = async (hashedPassword, inputPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

const generateHashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export default { comparePassword, generateHashedPassword };
