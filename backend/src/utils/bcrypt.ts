import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  try {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(`Password Hashing Error: ${error}`);
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    return bcrypt.compare(password, hash);
  } catch (error) {
    console.log(`Password Comparing Error: ${error}`);
  }
};
