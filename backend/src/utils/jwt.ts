import JWT from "jsonwebtoken";

export const generateAccessToken = (payload: object) => {
  try {
    return JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15m",
    });
  } catch (error) {
    console.log(`AccessToken Generate: ${error}`);
  }
};

export const generateRefreshToken = (payload: object) => {
  try {
    return JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "15m",
    });
  } catch (error) {
    console.log(`RefreshToken Generate: ${error}`);
  }
};

export const verifyToken = (token: string, SECRET_TOKEN: string) => {
  try {
    return JWT.verify(token, SECRET_TOKEN);
  } catch (error) {
    console.log(`Verify Token Error: ${error}`);
  }
};
