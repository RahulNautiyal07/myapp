const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Employeer',{useNewUrlParser:true,useUnifiedTopology: true})

var conn=mongoose.Collection;

var uploadSchema=new mongoose.Schema({
	imagename:String,
})
var uploadModel=mongoose.model('uploadimage',uploadSchema);
module.exports=uploadModel;

// var mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost:27017/Employeer',{useNewUrlParser:true,useUnifiedTopology: true});
// var conn=mongoose.connection;

// var employeeSchema = new mongoose.Schema({
     
//      name:String,
//      email:String,
//      etype:String,
//      hourlyrate:Number,
//      totalHour:Number,
//      total:Number,

// }) ;

// var employeeModel = mongoose.model('Data',employeeSchema);

// // const Emp=new employeeModel({

// //      name:"sdjkasbdkj",
// //      email:"raaj@gmail.com",
// //      etype:"sadb",
// //      hourlyrate:7,
// //      totalHour:13,
// //      total:12220,
// // });

// // Emp.save();

// module.exports=employeeModel;