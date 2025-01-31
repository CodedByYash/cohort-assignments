const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    Firstname:{type:String,required:true},
    Lastname:{type:String,required:true}
},{timestamps:true})

const adminSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    Firstname:{type:String,required:true},
    Lastname:{type:String,required:true}
},{timestamps:true})

const courseSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    imageUrl:{type:String,required:true},
    creatorId:{type:Schema.Types.ObjectId,ref:"adminSchema",required:true}
},{timestamps:true})

const purchaseSchema = new Schema({
    userId: {type:Schema.Types.ObjectId,ref:"userSchema",required:true},
    courseId: {type:Schema.Types.ObjectId,ref:"courseSchema",required:true}
},{timestamps:true});

const UserModel = mongoose.model("user",userSchema);
const AdminModel = mongoose.model("admin",adminSchema);
const CouresModel = mongoose.model("course",courseSchema);
const PurchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports({UserModel,AdminModel,CouresModel,PurchaseModel});