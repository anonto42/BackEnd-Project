var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
const passport = require('passport');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login' , {error:req.flash('error')});
});

router.get('/userProfile', async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render('profile',{user:user});
})

router.get('/profile', isLoggedIn , function(req, res, next) {
  res.render('profile');
});

router.get('/feed',(req,res)=>{
  res.render('feed');
})

router.post('/register', (req, res,)=>{
  const { username, email, fullname } = req.body;
  const newUser = new userModel({ username, email, fullname });
  userModel.register(newUser, req.body.password)
  .then(()=>{
    passport.authenticate('local')(req, res, ()=>{
      res.redirect('/profile');
    });
  })
})

router.post('/login',passport.authenticate('local',{
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res)=>{})

router.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}



module.exports = router;