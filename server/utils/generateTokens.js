import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const generatetokens = (userId) => {
    const accessToken = jwt.sign({id: userId}, process.env.JWT_ACCESS_SECRET,{
        expiresIn : process.env.JWT_ACCESS_EXPIRES_IN
    });
    const refreshToken = jwt.sign({id: userId}, process.env.JWT_REFRESH_SECRET,{
        expiresIn : process.env.JWT_REFRESH_EXPIRES_IN
    });


    return { accessToken , refreshToken };

    
};
export default generatetokens;