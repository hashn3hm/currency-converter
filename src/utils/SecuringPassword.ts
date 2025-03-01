import bcrypt from "bcrypt";

// export const hashPassword = (password: string): string => {
//   const salt: string = bcrypt.genSaltSync(10);
//   const hash: string = bcrypt.hashSync(password, salt);
//   console.log("salt", salt, "hash", hash);
//   return hash;
// };

export const hashPassword = async (password: string): Promise<string> => {

  if (!password) {
    throw new Error("Password is required for hashing");
  }

  try {
    const saltRounds = 10;
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hash: string = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};


export const comparePassword = async (password: string, receivedPassword: string) => {
  const isValidPassword = await bcrypt.compare(receivedPassword, password);
  return isValidPassword;
};
