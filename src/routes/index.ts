import { Request, Response, Router } from "express";

import {User, Todo, IUser, ITodo} from "../models/User";
import populateUserList from "../../data/users";
import { todo } from "node:test";

type TUser = {
    name: string;
    todos: string[];
}


const router: Router = Router();


/*
router.post('/add', async (req:Request, res:Response)=>{
    const dataEntry : TUser = req.body
    let userFound : boolean = false;
    console.log(dataEntry)
   
    res.status(200).json({ "message" : `Todo added successfully for user ${dataEntry.name}` });
})

*/


router.get("/todos/:id", async (req:Request, res:Response) =>{
    
    
    const userName = req.params.id;
    console.log(userName);
    const user : IUser | null = await User.findOne({name : userName});
    
    if(user){
        console.log(user.todos)
        res.status(200).json({todos: user.todos});
    }else{
        res.status(404).json({message : "User not found"});
    }

});

router.get("/api/allusers",async (req: Request, res: Response) => {
    try{
        const users : IUser[] | null = await User.find() 
        if(users.length === 0){
            res.status(404).json({message : "No users found"})
        }else{
            res.status(200).json(users)
        }
        
    }catch (error: any){
        console.log(error)
        res.status(500).json({message : "Internal server error"})
    }


})

router.put("/update", async (req: Request, res: Response) => {
   
    const { name, todo } = req.body;
    console.log(`Updating user: ${name}, removing todo: ${todo}`);
    let userFound = false;
    let todoFound = false;

    

    if (userFound && todoFound) {
        res.status(200).json({ message: "Todo deleted successfully." });
    } else if (!userFound) {
        res.status(404).json({ message: "User not found." });
    } else {
        res.status(404).json({ message: "Todo not found." });
    }
});

router.delete("/delete", async (req:Request, res:Response) => {
   
    const userToDelete : String = req.body.name
    console.log(userToDelete)
    let userFound : boolean = false;
    
});



router.post("/add", async (req: Request, res: Response) => {

    const dataEntry : TUser = req.body
    console.log(dataEntry)
    try {
        let user = await User.findOne({name: dataEntry.name});
        if (!Array.isArray(dataEntry.todos)) {
            dataEntry.todos = [dataEntry.todos]; 
        }
        if(user){
            const newTodos = dataEntry.todos.map(todoText => ({ todo: todoText }));
            console.log("uudet todoot", newTodos)
            user.todos.push(...newTodos);
            await user.save();
            console.log("Todos added")
        }else {
            const newTodos = dataEntry.todos.map(todoText => ({ todo: todoText }));
            user = new User({
                name: dataEntry.name,
                todos: newTodos
            });
            await user.save();
            console.log("User added")
        }
        res.status(200).json({ "message" : `Todo added successfully for user ${dataEntry.name}` })
    }catch(error){
        console.log(error)
        res.status(500).json({message : "Internal server error"})
    };


});




export default router