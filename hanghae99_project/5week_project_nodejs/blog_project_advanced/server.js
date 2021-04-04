const express = require('express')
const mongoose = require('mongoose')
const User = require("./models/user");
const Com = require('./models/com')
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware")
const app = express()
const router = express.Router();
const Article = require('./models/article')
const methodOverride = require('method-override')


app.use(express.urlencoded({ extended : false}))
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));


//// [method-override]
app.use(methodOverride('_method'))

//// [MongoDB]
mongoose.connect('mongodb://localhost:27017/admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      ignoreUndefined: true,
    // user: "test",
    // pass: "test"
})

//// [Router] 
const articleRouter = require('./routes/articles')


//// [Routes]
app.use('/articles', articleRouter)

//// [EJS]
app.set('view engine', 'ejs')


//// [Get, Main page 정보 받아옴]
app.get('/main', async (req, res) => {
    const articles = await Article.find().sort({ createdAt : 'desc'})
    res.render('articles/index', { articles : articles})
})

/////////////////////////////////////////////////////////////


//// [Post - 회원가입]
router.post("/users", async (req, res) => {
    const { nickname, email, password, confirmPassword} = req.body; 

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage : '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        }); // 400 : bad request
        return; // 리턴하지 않으면 패스워드가 다르더라도 밑에 코드가 실행됨.
    }

    
    const existUsers = await User.findOne({    // User 몽구스 모델에서, find를 함으로써 값을 여러개 가져옴(조건 맞는것 - 이메일이 겹치거나 닉네임이 겹칠때)
        $or : [{ email }, { nickname }],    // 존재하는 email or nickname 이 있는지 
    });
    if (existUsers){// NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다:
        res.status(400).send({
            errorMessage : '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return; // error가 났으면 끝난거임.
    }

    const user = new User({ email, nickname, password}) // 데이터 베이스에 저장
    await user.save();

    res.status(201).send({});
});


//// [Post - 로그인]
router.post("/auth", async (req, res) => {
    const { email, password} = req.body;
  
    const user = await User.findOne({ email, password}).exec();
  
    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage : '이메일 또는 패스워드가 잘못됐습니다.'
        });
        return;
    }
  
    const token = jwt.sign({ userId : user.userId }, "my-secret-key")    // userId 키를 가진곳에 넣어야됨.
                                                                         // 로그인 할 때 해당하는 userId를 암호화
    res.send({                                                            // userId : user.Id 을 token 에 담고 출발~ 
        token,
    });
  });


//// [Port]
app.listen(3000)