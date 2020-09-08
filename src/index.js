document.addEventListener("DOMContentLoaded", e => {
    let addTask = false;

    const taskUrl = "http://localhost:3000/tasks/"
    const userUrl = "http://localhost:3000/users/1"
    const taskForm = document.querySelector(".add-task-form") //reset form
    const addBtn = document.querySelector("#new-task-btn");
    const taskFormContainer = document.querySelector(".container");
    const listTitleUl = document.querySelector(".list-title")
    const weekTable = document.querySelector(".week-table")
    const calendarDiv = document.querySelector("#node8")
    const monthH1 = document.createElement("h1")    //create a node on index.html instead

    const getTasks = () => {
        fetch(taskUrl)
        .then(response => response.json())
        .then(tasks => renderTasks(tasks))
    }
    
    const renderTasks = (tasks) => {
        monthH1.innerText = "September 2020"
        calendarDiv.append(monthH1)
        // console.log(tasks)
        for (task of tasks){
        let taskDesc = task.description
        let taskName = task.taskname
        let taskDate = task.date
        let taskPom = task.pomodoro
        let taskId = task.id
        let today = new Date().toISOString().split('T')[0]
        // console.log(today)
        // console.log(taskDate)
        //if a click on the calendar is triggered, overwrite the list with the date selected
            if(today === taskDate){
            renderList(taskName, taskDesc, taskId, taskDate, taskPom)
            } 
        }   
    }

    const renderCalendarTasks = (tasks, date) => {
        //find the date selected and render tasks

        //tasks.filter then forEach (map in react)
        tasks.forEach(task => {
          let clickedDate = `2020-09-${date}`
          let formattedDate = new Date(clickedDate).toISOString().split('T')[0]
          let taskDate = task.date
          if(formattedDate === taskDate){

            let taskDesc = task.description
            let taskName = task.taskname
            let taskPom = task.pomodoro
            let taskId = task.id
            renderList(taskName, taskDesc, taskId, taskDate, taskPom)
             } 
        })   
    }

    const renderList = (taskName, taskDesc, taskId, taskDate, taskPom) => {

        // listTitleUl.innerText = `Tasks for the day: ${taskDate}`
        const taskLi = document.createElement("li")
        taskLi.dataset.pomodoro = taskPom
        taskLi.dataset.id = taskId
        taskLi.innerText = `${taskName} - ${taskDesc} (${taskPom} Pomodoro)`
        listTitleUl.appendChild(taskLi)
        console.log(listTitleUl)
    }

//Calendar >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function createCalendar(elem, year, month) {

        let mon = month - 1; // months in JS are 0..11, not 1..12
        let d = new Date(year, mon);
  
        let table = '<table class="calendar" border="1"><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';
  
        // spaces for the first row
        // from Monday till the first day of the month
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

    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addTask = !addTask;
        if (addTask) {
          taskFormContainer.style.display = "none"
        } else {
          taskFormContainer.style.display = "block"
        }
      })

    document.addEventListener("submit", e => {
        e.preventDefault()
        if (e.target === taskForm){
            let taskName = document.querySelector('[name=task-name]').value
            let taskDate = document.querySelector('[name=date]').value
            let taskTime = document.querySelector('[name=time]').value
            let taskPom = parseInt(document.querySelector('[name=pomodoro]').value)
            let taskDesc = document.querySelector('textarea').value

            const taskObj = {
            taskname: taskName,
            description: taskDesc,
            status: false,
            pomodoro: taskPom, 
            date: taskDate,
            time: taskTime,
            user_id: 4
            }

            const configObj = {
               method: "POST",
               headers: {
                 "content-type": "application/json",
                 "accept": "application/json"
               },
               body: JSON.stringify(taskObj)
            } 
                fetch(taskUrl, configObj)
                .then(response => response.json())
                // .then(data => )
        }
    })

//invoke functions
getTasks()
createCalendar(calendarDiv, 2020, 9);


})//end of DOMContentLoaded