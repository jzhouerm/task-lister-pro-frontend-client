document.addEventListener("DOMContentLoaded", e => {
    const taskUrl = "http://localhost:3000/tasks/"
    const userUrl = "http://localhost:3000/users/1"
    const taskForm = document.querySelector(".add-task-form") //reset form
    const addBtn = document.querySelector("#new-task-btn");
    const taskFormContainer = document.querySelector(".container");
    const listTitleUl = document.querySelector(".list-title")
    const weekTable = document.querySelector(".week-table")
    const calendarDiv = document.querySelector("#node8")

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
        //if a click on the calendar is triggered, overwrite the list with the date selected
            if(today === taskDate){
            renderList(taskName, taskDesc, taskId, taskDate, taskPom)
            break;
            } 
        }   
    }

    const renderCalendarTasks = (tasks, date) => {
        //find the date selected and render tasks
        for (task of tasks){
        let taskDesc = task.description
        let taskName = task.taskname
        let taskDate = task.date
        let taskPom = task.pomodoro
        let taskId = task.id
        let clickedDate = `2020-09-${date}`
        let formattedDate = new Date(clickedDate).toISOString().split('T')[0]
            if(formattedDate === taskDate){
                renderList(taskName, taskDesc, taskId, taskDate, taskPom)
                break;
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

//Calendar >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function createCalendar(elem, year, month) {

        let mon = month - 1; // months in JS are 0..11, not 1..12
        let d = new Date(year, mon);
  
        let table = '<table class="calendar" border="1"><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';
  
        // spaces for the first row
        // from Monday till the first day of the month
        // * * * 1  2  3  4
        for (let i = 0; i < getDay(d); i++) {
          table += '<td></td>';
        }
  
        // <td> with actual dates
        while (d.getMonth() == mon) {
          table += '<td class="calendar-date">' + d.getDate() + '</td>';
  
          if (getDay(d) % 7 == 6) { // sunday, last day of week - newline
            table += '</tr><tr>';
          }
  
          d.setDate(d.getDate() + 1);
        }
  
        // add spaces after last days of month for the last row
        // 29 30 31 * * * *
        if (getDay(d) != 0) {
          for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>';
          }
        }
  
        // close the table
        table += '</tr></table>';
  
        elem.innerHTML = table;
      }
  
      function getDay(date) { // get day number from 0 (monday) to 6 (sunday)
        let day = date.getDay();
        if (day == 0) day = 7; // make Sunday (0) the last day
        return day - 1;
      }

//Event listeners >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   document.addEventListener("click", e => {
        if(e.target.className === ("calendar-date")){

            let clickedDate = e.target.innerText
            
            fetch(taskUrl)
            .then(response => response.json())
            .then(tasks => renderCalendarTasks(tasks, clickedDate))
        }
    })

    let addTask = false;
    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addTask = !addTask;
        if (addTask) {
          taskFormContainer.style.display = "block"
        } else {
          taskFormContainer.style.display = "none"
        }
      })
    document.addEventListener("submit", e => {

    })

//invoke functions
getTasks()
createCalendar(calendarDiv, 2020, 9);


})//end of DOMContentLoaded