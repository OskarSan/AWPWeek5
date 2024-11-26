import { Request, Response, Router } from "express";

type TUser = {
    name: string;
    todos: string[];
}

let userList: TUser[] = [];
const router: Router = Router();
const filePath = "./data.json";
const fs = require('fs').promises;

async function loadUserListFromFile(filePath:String){
 
    try {
        await fs.access(filePath);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            
            console.log(`File not found. Creating new file at: ${filePath}`);
            await fs.writeFile(filePath, JSON.stringify([]), 'utf8');
        } else {
            console.error('Error checking file existence:', error);
            throw error;
        }
    }
 
    try {
        const data = await fs.readFile(filePath, 'utf8');
        if (data) {
            userList = JSON.parse(data);
        }
    }catch (error){
        console.log(error)
    }
}


async function saveDataToFile(filePath: String, data: TUser[]) {
    try{
        
        const data = JSON.stringify(userList);
        await fs.writeFile(filePath, data, 'utf8');
        console.log("Data saved successfully.");

    }catch (error) {
        console.error(error);
    }
}


loadUserListFromFile(filePath);


router.post('/add', async (req:Request, res:Response)=>{
    const dataEntry : TUser = req.body
    let userFound : boolean = false;
    console.log(dataEntry)
    for (const user of userList) {
        if(dataEntry.name === user.name){

            if (!Array.isArray(user.todos)) {
                user.todos = []; 
            }
            if(Array.isArray(dataEntry.todos)){
                user.todos.push(...dataEntry.todos)
            }else{
                user.todos.push(dataEntry.todos)
            }
            
            userFound = true
            console.log("todoot lisätty")
            break;
        
        
        }
    }
    if(!userFound){
        if (!Array.isArray(dataEntry.todos)) {
            dataEntry.todos = [dataEntry.todos]; 
        }
        console.log("käyttäjä listääy")
        userList.push(dataEntry)
    }
 
    console.log(userList)

    await saveDataToFile(filePath, userList)
    res.status(200).json({ "message" : `Todo added successfully for user ${dataEntry.name}` });
})




router.get("/todos/:id", async (req:Request, res:Response) =>{
    
    await loadUserListFromFile(filePath);
    const userId = req.params.id;
    console.log(userId);
    console.log(userList);
    
    const user = userList.find(user => user.name === userId);

    if (user) {
        res.status(200).json({ todos: user.todos });
    } else {
        res.status(404).json({ message: "User not found" });
    }

});

router.get("/all",async (req: Request, res: Response) => {
        await loadUserListFromFile(filePath);
        res.status(200).json(userList);
    }
)
router.put("/update", async (req: Request, res: Response) => {
    await loadUserListFromFile(filePath);
    const { name, todo } = req.body;
    console.log(`Updating user: ${name}, removing todo: ${todo}`);
    let userFound = false;
    let todoFound = false;

    for (const user of userList) {
        if (user.name === name) {
            userFound = true;
            const todoIndex = user.todos.indexOf(todo);
            if (todoIndex !== -1) {
                user.todos.splice(todoIndex, 1);
                todoFound = true;
                break;
            }
        }
    }

    await saveDataToFile(filePath, userList);

    if (userFound && todoFound) {
        res.status(200).json({ message: "Todo deleted successfully." });
    } else if (!userFound) {
        res.status(404).json({ message: "User not found." });
    } else {
        res.status(404).json({ message: "Todo not found." });
    }
});

router.delete("/delete", async (req:Request, res:Response) => {
    await loadUserListFromFile(filePath);
    const userToDelete : String = req.body.name
    console.log(userToDelete)
    let userFound : boolean = false;
    for (const user of userList) {
        if(userToDelete === user.name){
            userList = userList.filter((user) => user.name !== userToDelete);
            userFound = true
            break;
        }
    }
    await saveDataToFile(filePath, userList)

    if(userFound){
        res.status(200).json({ message : "User deleted successfully"})
    }else{
        res.status(404).json({ message : "User not found"})
    }
});



export default router