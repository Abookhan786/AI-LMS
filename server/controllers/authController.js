import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users";
import generatetokens from "../utils/generateTokens.js";


export const register = async(req, res) => {

    try{
        const {name, email, role, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
       return  res.status(400).json({message : "User already regsitered"});
    }
    const hashedPassword = await bycrypt.hash(password,10);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,

    });

    res.status(201).json({message: " user registered successfully",
        user: newUser,
    });
} catch(error){
    res.status(500).json({message : "Server error", error});


}
};

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid email or password"});

        }
        const isMatch = await bycrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
            
        }
        const {accessToken , refreshToken } = generatetokens(user._id);
        res
            .cookie("refresh_token",refreshToken, {
                 httpOnly: true,
                 secure: true,
                 sameSite: "strict",
        })
            .json({
                message: "Login succesfull",
                accessToken,
                user,
            });

            


    }
    catch(error){
        res.status(500).json({message: "Server error", error});
    }

};
export const refreshToken = (req, res) => {
    try{
        const token = req.cookie.refreshToken;
        if(!token){
            return res.status(401).json({message: "No refresh token"});

        }
        jwt.verify(token, process.env.JWT_REFRESH_SECRET , (err , decoded) => {
            if(err){
                return res.status(403).json({message : "Invalid refresh token"});
            }
            const {accessToken} = generatetokens(decoded.id);
            res.json({accessToken});

        });
        
    }
    catch(error){
            res.status(500).json({message : "Server error",error});
        }
};
export const logout = (req , res) => {
    res.clearCookie("refresh_token").json({message : "Logout successfully"});
};

