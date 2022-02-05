import mongoose from 'mongoose';


const todosSchema = new mongoose.Schema({
    todo: String
})

const Todos = mongoose.model('todos', todosSchema)

export default Todos;