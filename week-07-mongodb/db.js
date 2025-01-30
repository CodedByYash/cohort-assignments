const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
    name:String,
    email:{ type: String, unique: true, required: true },
    password:{ type: String, required: true }
}, { timestamps: true })

const Todo = new Schema({
    userId:{type: Schema.Types.ObjectId,ref:"users", required: true},
    title:{ type: String, required: true },
    isDone: { type: Boolean, default: false },
    date:  { type: Date, default: Date.now }
},{ timestamps: true })

const UserModel = mongoose.model("users",User);
const TodoModel = mongoose.model("todos",Todo);

module.exports = {
    UserModel,
    TodoModel
}