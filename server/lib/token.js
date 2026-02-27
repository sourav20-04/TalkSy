import jsonwebtoken from 'jsonwebtoken';
import '../config.js'
const CreateToken = (userId)=>{
    const token = jsonwebtoken.sign({userId},process.env.JWT_SECRET,{expiresIn: "7d"});
    return token
}

export default CreateToken;