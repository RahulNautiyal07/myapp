var express = require('express');
var router = express.Router();
var userModule=require('../dbs/user');


var employee=userModule.find({});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WELCOME TO USER LIST' });
});

router.get('/createUser',function(req,res,next){
  res.render('create_user', { title:'Create User From Here',msg:''});
});

router.post('/createUser',function(req,res,next){
      var username=req.body.username;
      var email=req.body.email;
      var password=req.body.password;
      var confpassword=req.body.conf_password;
      if(confpassword!=password){
      	res.render('create_user', { title: 'Password Management System',msg:'Password Not Matched !'});
      }else{
      var userDetail=new userModule({
        username:username,
        email:email,
        password:password
      });
      userDetail.save((err,doc)=>{
       if(err) throw err;
       res.send('successfully done ');

      // res.redirect('/list');
      });
    }
});


router.get('/list',function(req,res,next){
  employee.exec(function(err,data)
  {
    if(err) throw err;
    res.render('list', { title:' Users Record ',records:data});
  })
 +9
});

//---------------------------------------------(update User)-----------------------------------------

router.get('/list/edit/:id',function(req,res,next){
  var par_id=req.params.id;

  var getUserDetail=userModule.findById({_id:par_id});
  getUserDetail.exec(function(err,data){
    if(err) throw err;
    res.render('update_user',{title:'Update User Data from here',records:data});

  });
})

router.put('/updateUser',function(req,res,next){
  var id=req.body.id;
  var username=req.body.username;
  var password=req.body.password;
  var email=req.body.email;
  var update=new Date();

  var userUpdate=userModule.findByIdAndUpdate(id,{username:username,email:email,password:password,update:update});
  userUpdate.exec(function(err,doc){
    if(err) throw err;
    res.send('Updated Successfully !');
   // res.redirect('/list');
  });
});

router.delete('/list/delete',function(req,res,next){
  var para_id=req.body.id;
  var userDelete=userModule.findByIdAndDelete(para_id);
  userDelete.exec(function(err){
    if(err) throw err;
  //  res.redirect('/list');
    res.send('Deleted Successfully');
   });
});

module.exports = router;
