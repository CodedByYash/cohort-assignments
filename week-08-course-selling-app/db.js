const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    email: {type : String, unique : true, required : true },
    password: { type : String, required : true },
    firstname: { type : String, required : true },
    lastname: { type : String, required : true }
},{ timestamps : true })

const adminSchema = new Schema({
    email: { type : String, unique : true, required : true },
    password: { type : String, required : true },
    firstname: { type : String, required : true },
    lastname: { type : String, required : true }
},{ timestamps:true })

const courseSchema = new Schema({
    title: { type : String, required : true },
    description: { type : String, required : true },
    price: { type : Number, required : true },
    imageUrl: { type : String, required : true },
    creatorId: { type : Schema.Types.ObjectId, ref : "admin", required : true }
},{ timestamps:true })

const purchaseSchema = new Schema({
    userId: { type : Schema.Types.ObjectId, ref : "user", required : true },
    courseId: { type : Schema.Types.ObjectId, ref : "course", required : true }
},{ timestamps:true });

const UserModel = mongoose.model("user",userSchema);
const AdminModel = mongoose.model("admin",adminSchema);
const CourseModel = mongoose.model("course",courseSchema);
const PurchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports={UserModel,AdminModel,CourseModel,PurchaseModel};