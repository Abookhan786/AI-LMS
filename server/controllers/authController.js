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
        const {accessToken , refreshToken } = generatetokens;
        res
            .cookie("refresh_tokrn",refreshToken, {
                 httpOnly: true,
                 secure: false,
                 sameSite: "lax",
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

