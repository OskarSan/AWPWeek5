

    const todoForm = document.getElementById("todoForm");
    const searchForm = document.getElementById("searchForm")
    const searchButton = document.getElementById("search");
     
    const addConfirmationText = document.createElement("p");
    const searchConfirmationText = document.createElement("p");
    const deleteButton = document.getElementById("deleteUser");
    
    const searchOutput = document.getElementById("todoList")

    
    todoForm.addEventListener("submit", async (event)=>{
        
        event.preventDefault();
        const name = document.getElementById("userInput").value
        const todos = document.getElementById("todoInput").value
       
        const userData = await fetch ('/add', {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                todos: todos
            })

        })

        res = await userData.json();
        addConfirmationText.textContent = res.message;
        todoForm.appendChild(addConfirmationText);

        document.getElementById("userInput").value =""
        document.getElementById("todoInput").value =""

        
         
    });

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
       
       
    });

    
    searchButton.addEventListener("click", async (event)=>{
        event.preventDefault();
        const searchInput = document.getElementById("searchInput").value
        searchOutput.innerHTML = ""; // Clear all child elements from the searchOutput container
        searchConfirmationText.textContent = ""; // Reset the confirmation text
        

        
        const res = await fetch (`/todos/${searchInput}`);
        
        const todoJSON = await res.json();
            

        if (res.ok){
            console.log(todoJSON, "frontissa")
            todoJSON.todos.forEach((todo, index) => {
                const listEntry = document.createElement('li');
                const deleteLink = document.createElement('a');
                deleteLink.href = "#";
                deleteLink.textContent = todo.todo;
                deleteLink.classList.add("delete-task");
                deleteLink.addEventListener("click", async (event) => {
                    event.preventDefault();
                    const res = await fetch("/update", {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            name: searchInput,
                            todo: todo.todo
                        })
                    });

                    const deleteRes = await res.json();
                    if (res.ok) {
                        searchOutput.removeChild(listEntry);
                        searchConfirmationText.textContent = deleteRes.message;
                    } else {
                        searchConfirmationText.textContent = deleteRes.message;
                    }
                    searchForm.appendChild(searchConfirmationText);
                });
                listEntry.appendChild(deleteLink);
                searchOutput.appendChild(listEntry);
            });


        }else{
            searchConfirmationText.textContent = todoJSON.message
            searchForm.appendChild(searchConfirmationText)
        }
        
        
        deleteButton.style.display = "block";

    })

    deleteButton.addEventListener("click", async (event)=>{
        event.preventDefault();
        const searchInput = document.getElementById("searchInput").value
        console.log(searchInput, "searchInput")
        const res = await fetch ("/delete", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: searchInput}),
        });

        const deleteConfirmationText = document.createElement("p");
        
        const deleteOutput = document.getElementById("deleteOutput");
        deleteOutput.innerHTML = "";

        const deleteJSON = await res.json();
        console.log(deleteJSON, "deleteJSON")
        deleteConfirmationText.textContent = deleteJSON.message;
        deleteOutput.appendChild(deleteConfirmationText);

        searchOutput.innerHTML = "";
        searchConfirmationText.textContent = "";
        deleteButton.style.display = "none";
    });


