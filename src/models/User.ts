import mongoose, {Document, Schema} from "mongoose";

interface ITodo {
    todo: string;
    checked: boolean;
}


interface IUser extends Document {
    name: string;
    todos: ITodo[];

}



// Create the Todo schema
const todoSchema: Schema<ITodo> = new Schema({
    todo: { type: String, required: true },
    checked: { type: Boolean, required: true, default: false }
});

// Create the User schema and reference the Todo schema
const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    todos: [todoSchema]
});

// Create the Todo model
const Todo: mongoose.Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema);

// Create the User model
const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User, Todo, IUser, ITodo };