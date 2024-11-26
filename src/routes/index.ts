import { Request, Response, Router } from "express";

import {User, Todo, IUser, ITodo} from "../models/User";
import populateUserList from "../../data/users";

type TUser = {
    name: string;
    todos: string[];
}


const router: Router = Router();



router.post('/add', async (req:Request, res:Response)=>{
    const dataEntry : TUser = req.body
    let userFound : boolean = false;
    console.log(dataEntry)
   
    res.status(200).json({ "message" : `Todo added successfully for user ${dataEntry.name}` });
})




router.get("/todos/:id", async (req:Request, res:Response) =>{
    
   
    const userId = req.params.id;
    console.log(userId);
    

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



router.get("/api/users/populate", async (req: Request, res: Response) => {
    for (let i = 0; i < populateUserList.length; i++) {
        const todos = await Promise.all(
            populateUserList[i].todos.map(async (todoText) => {
                const todo = new Todo({ todo: todoText });
                await todo.save();
                return todo;
            })
        );

        const user: IUser = new User({
            name: populateUserList[i].name,
            todos: todos
        });

        await user.save();
    }
    console.log("Users discombobulated");
    res.json({ message: "Users discombobulated" });
});




export default router