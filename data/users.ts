import { StringSchemaDefinition } from "mongoose"

type User = {
    name: string;
    todos: string[];
}

const populateUserList : User[] = [
    {
        name: "John Doe",
        todos: ["Buy groceries", "Clean the house", "Do laundry"]
    },
    {
        name: "Jane Doe",
        todos: ["Walk the dog", "Wash the car", "Take out the trash"]
    }
]


export default populateUserList;