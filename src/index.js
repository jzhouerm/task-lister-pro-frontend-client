document.addEventListener("DOMContentLoaded", e => {
    const taskUrl = "http://localhost:3000/tasks/"
    const userUrl = "http://localhost:3000/users/1"
    const listTitleUl = document.querySelector(".list-title")

    const getTasks = () => {
        fetch(taskUrl)
        .then(response => response.json())
        .then(tasks => renderTasks(tasks))
    }
    
    const renderTasks = (tasks) => {
        for (task of tasks){
        let taskDesc = task.description
        let taskName = task.taskname
        let taskDate = task.date
        let taskPom = task.pomodoro
        let taskId = task.id
        let today = new Date().toISOString().split('T')[0]
        
            if(today === taskDate){
                //if todays date is equal to taskDate
                renderList(taskName, taskDesc, taskId, taskDate, taskPom)
                }
        }   
    }

    const renderList = (taskName, taskDesc, taskId, taskDate, taskPom) => {
        listTitleUl.innerText = `${taskDate}`
        const taskLi = document.createElement("li")
        taskLi.dataset.pomodoro = taskPom
        taskLi.dataset.id = taskId
        taskLi.innerText = `${taskName} - ${taskDesc}`
        listTitleUl.append(taskLi)
    }

getTasks()

})//end of DOMContentLoaded