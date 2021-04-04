const jwt = require("jsonwebtoken")
const User = require("../models/user") 

module.exports = (req, res, next) => {
    
    console.log("여기를 지나쳤어요")
    const { authorization } = req.headers; 
                                         
    console.log(authorization)                                        
    const [tokenType, tokenValue] = authorization.split(' ');   
    console.log(tokenValue);              

    if (tokenType !== 'Bearer'){   
        res.status(401).send({
            errorMessage : '로그인 후 사용하세요',
        });
        return; // next가 호출 안되게
    }

    try { 
        const { userId } = jwt.verify(tokenValue, "my-secret-key") 
        console.log("userID 값 : ", userId) 
        User.findById(userId).exec().then((user) => {
            res.locals.user = user;                           
            next();
        });

    }catch(error){
        res.status(400).send({
            errorMessage : "로그인 후 사용하세요",
        })
        return;
    }
}

