    var express = require('express');
var router = express.Router();
var multer=require('multer');
var path= require('path');
var jwt=require('jsonwebtoken');


var uploadModel=require('../modules/upload');
var empModel=require('../modules/employee');

var employee=empModel.find({});
var imageData=uploadModel.find({});


if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checklogin(req,res,next){
  var mytoken=localStorage.getItem('mytoken');
  try {
   jwt.verify(mytoken, 'logintoken');
} catch(err) {
  res.send("you need to login to acess this page");
}
 
next();

}

router.get('/login',function(req,res,next){
var token = jwt.sign({ foo: 'bar' }, 'logintoken');
localStorage.setItem('mytoken', token);

res.send("Login Successfully");
});
 
router.get('/logout',function(req,res,next){
  localStorage.removeItem('mytoken');
res.send("Logout Successfully");
});

/* GET home page. */
router.get('/',checklogin, function(req, res, next) {
	employee.exec(function(err,data){
		if(err) throw err;0
 	
  res.render('index', { title: 'Employee Records',records:data,success:'' });
});
	});

router.post('/',function(req,res,next){
  
  var empDetails=new empModel({
  	name: req.body.uname,
  	email: req.body.email, 
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total:parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
  });
  empDetails.save(function(err,req1){
  	if(err) throw err;
  	  	employee.exec(function(err,data){
		 if(err) throw err;
         res.render('index', { title: 'Employee Records',records:data,success:'Record Inserted Successfully' });
      });
  });
   console.log("Inserted SuccessFully");
  

});

// ========================================Filter==================================================

router.post('/search/',function(req,res,next){
 
 var fltrName=req.body.fltrname;
 var fltrEmail=req.body.fltremail;
 var fltremptype=req.body.fltremptype;

 if(fltrName!='' && fltrEmail!='' && fltremptype!='')
 {
  var flterParameter = { $and:[{ name:fltrName },
  {$and:[{email:fltrEmail},{etype:fltremptype}]}
  ]
   }
  }else if(fltrName!='' && fltrEmail=='' && fltremptype!=''){
  	var flterParameter={ $and:[{name:fltrName},{etype:fltremptype}]}
  }
  else if(fltrName=='' && fltrEmail!='' && fltremptype!=''){
  	var flterParameter={ $and:[{email:fltrEmail},{etype:fltremptype}]}
  }else {
  	var flterParameter={}
  }

	  var employeeFilter=empModel.find(flterParameter);
	  employeeFilter.exec(function(err,data){
     if(err) throw err;
     res.render('index',{title:'Employee Records',records:data,success:"Search Results"});
   });
});

// ============================================Delete===================================================
router.get('/delete/:id', function(req, res, next) 
{

var id=req.params.id;
var del=empModel.findByIdAndDelete(id);

	del.exec(function(err){
		if(err) throw err;
 	
employee.exec(function(err,data){
		 if(err) throw err;
         res.render('index', { title: 'Employee Records',records:data,success:'Record Deleted Successfully' });
      });
});
	});


// ========================================Edit===================================================
router.get('/edit/:id', function(req, res, next) {
 var id=req.params.id;
 var edit=empModel.findById(id);

	edit.exec(function(err,data){
		if(err) throw err;
 	
  res.render('edit', { title: 'Employee Record',records:data });
});
	});


router.post('/update/', function(req, res, next) {

 var update=empModel.findByIdAndUpdate(req.body.id,{
 	name: req.body.uname,
  	email: req.body.email, 
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    totalHour: req.body.ttlhr,
    total:parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),

 });

	update.exec(function(err,data){
		if(err) throw err;
 	
employee.exec(function(err,data){
		 if(err) throw err;
         res.render('index', { title: 'Employee Records',records:data,success:'Record Updated Successfully' });
      });});
	});

// ========================================Upload Image================================================

router.use(express.static(__dirname+"./public/"));

var Storage=multer.diskStorage({
	destination:"./public/uploads/",
	filename:(req,file,cb)=>{

  cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));

	}
});

var upload=multer({
storage:Storage

}).single('file');

router.post('/upload',upload, function(req, res, next) {
	var imageFile=req.file.filename;
 	 var success=req.file.fieldname+"uploaded successfully";
 	 var imageDetails=new uploadModel({
      imagename:imageFile
      
 	 });
 	 imageDetails.save(function(err,doc){
      if(err) throw err;

      imageData.exec(function(err,data){
      	if(err) throw err;
      	  res.render('upload-file', { title: 'Uplaod File',records:data,success:success });
      })
     
 	 });
    

	});

  router.get('/upload', function(req, res, next) {	
   imageData.exec(function(err,data){
      	if(err) throw err;
      	  res.render('upload-file', { title: 'Uplaod File',records:data,success:'' });
      });
     
	});

module.exports = router;
