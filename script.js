const taskInput = document.querySelector(".task-input input")
const taskBox = document.querySelector(".task-box")

let editId
let isEditedTask = false

let todos = JSON.parse(localStorage.getItem("todo-list"))

function showToDo(){
    let li = ""
    if(todos){
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : ""

            li += `<li class="task" draggable="true">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" name="" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')">Edit</li>
                        <li onclick="deleteTask(${id})">Delete</li>
                    </ul>
                </div>
            </li>`;
        })
    }
    taskBox.innerHTML = li
}

taskBox.addEventListener("dragover", e => {
    e.preventDefault()
    const drag = document.querySelector(".drag")
    const afterElement = getDragAfterElement(taskBox, e.clientY)
    if (afterElement == null) {
        taskBox.appendChild(drag)
    } else {
        taskBox.insertBefore(drag, afterElement)
    }
    
})

function dragging(){
    let lis = document.querySelectorAll(".task")
    lis.forEach(list => {
        list.addEventListener('dragstart', () =>{
            list.classList.add("drag")
        })

        list.addEventListener('dragend', () => {
            list.classList.remove("drag")
            
            let allTasks = document.querySelectorAll("li.task p")
            let newList = []
            console.log(allTasks)
            allTasks.forEach(task => {
                let tasks = {name: task.innerHTML, status: "pending"}
                newList.push(tasks)
            })
            localStorage.setItem("todo-list", JSON.stringify(newList))
        })
    })
}

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll(".task:not(.drag)")]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset){
            return {offset: offset, element: child}
        } else {
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

showToDo()
dragging()
function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add("show")
    document.addEventListener("click", e => {
        if(e.target != selectedTask || e.target.tagName != "I" ){
            taskMenu.classList.remove("show")
        }
    })
}

function editTask(taskId, taskName){
    editId = taskId
    isEditedTask = true
    taskInput.value = taskName
}

function deleteTask(deleteId){
    todos.splice(deleteId, 1)
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showToDo()
}

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild
    if(selectedTask.checked){
        taskName.classList.add("checked")
        todos[selectedTask.id].status = "completed"
    }else{
        taskName.classList.remove("checked")
        todos[selectedTask.id].status = "pending"
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}
 
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim()
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){
            if(!todos){
                todos = []
            }
            let taskInfo = {name: userTask, status: "pending"}
            todos.push(taskInfo)
        }else{
            isEditedTask = false
            todos[editId].name = userTask
        }
        taskInput.value = ""
        localStorage.setItem("todo-list", JSON.stringify(todos))
        showToDo()
        dragging()
    }
})

