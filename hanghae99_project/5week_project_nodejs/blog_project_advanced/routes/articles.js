const express = require('express')
const Article = require('./../models/article')
const Com = require('./../models/com')
const router = express.Router()
const authMiddleware = require("../middlewares/auth-middleware")
const jwt = require("jsonwebtoken");

//// [Get-new]
router.get('/new', (req, res) =>{
    res.render('articles/new', {article : new Article() })
})


//// [GET-show]
router.get('/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id)
    if (article == null) res.redirect('/')
    res.render('articles/show', { article : article})
})

//// [GET-edit]
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article : article })
})

//// [GET-edit_comment]
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit_commit', {article : article })
})

//// [GET-comment]
router.get('/comment/:id', async ( req, res ) => {

    // try{
    //     const comment = await Com.find({ commenter : req.params.id, author : req.params.id }).populate('commenter', 'author');  
    // }catch(e){
    //     console.log(e)
    // }

    res.render('articles/comment', {com : new Com()})
})

////[Delete]
router.delete('/:id', async (req, res) => {
    let article = await Article.findById(req.params.id)
    if (article.password == req.body.password){
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/main')
    }else{
        window.location.reload()
    }
})


//// [Post]
router.post('/', async (req,res) => {
   // const{userId} = jwt.verify(token, "my-secret-key")

    let article = new Article({
        title : req.body.title,
        author : req.body.author,
        password : req.body.password,
        description : req.body.description,
    })
    try{
        article = await article.save()    //article에 새로 저장
        res.redirect(`/articles/${article.id}`)
    } catch(e){
        console.log(e)
        res.render('articles/new', {article : article})
    }
})

//// [POST - 댓글]
router.post('/comment', async (req,res) => {
    // 1. req.body 아무것도 없네
    // 2. req.body에 값을 받아와야되네
    // 3. 클라이언트에서 값을 주기 위해서는 (comment, )

    // const {id} = req.params;
    const { comment } = req.body;    // 클라이언트 -> 서버로 주는 것.
    console.log(comment);       // sdsfsdg
    //console.log(commenter);     // undefined
    //console.log(author);        // undefined
    // const { userId } = res.locals.user;
    
    //  게시글에 대한 정보(id) 받아오기 
    //req.body.commenter = commenter._id
    //  로그인 사용자에 대한 정보(id) 받아오기
    //req.body.author = req.user._id
    
    const article = await Article.findById(id);
    let newcom = await Com.create({
        comment,
        //commenter : author._id,  // ..디비에서 지웠어요.
        author : userId,          // ...이부분을.. 뷰에서 받아와봅시다
    })
      try{
          com.save();    
          res.redirect(`/main`) // 서버가 클라이언트한테 주는 정보
      } catch(e){
          console.log(e)
          res.render('/main')
      }
  });

//// [PUT - 게시글]
router.put('/:id', async (req, res) => {
    let article = await Article.findById(req.params.id)

    if (article.password == req.body.password){
        article.title = req.body.title
        article.author = req.body.author
        article.password = req.body.password
        article.description = req.body.description
    }else{
        window.location.reload()
    }
    
    try{
        article = article.save()   
        res.redirect(`/main`)
    } catch(e){ 
        res.render('articles/edit', {article : article})
    }
})




module.exports = router
