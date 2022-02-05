import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: String,
    todos: Array

})

const User = mongoose.model('user', userSchema)

export default User;