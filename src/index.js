document.addEventListener("DOMContentLoaded", e => {
    let addTask = false;

    const taskUrl = "http://localhost:3000/tasks/"
    const userUrl = "http://localhost:3000/users/1"
    const taskForm = document.querySelector(".add-task-form") //reset form
    const addBtn = document.querySelector("#new-task-btn")
    const taskFormContainer = document.querySelector(".container");
    const listTitleUl = document.querySelector(".list-title")
    const weekTable = document.querySelector(".week-table")
    const calendarDiv = document.querySelector("#node8")
    const monthH1 = document.createElement("h1")    //create a node on index.html instead
    const taskHeader = document.querySelector(".taskheader")
    const parentDiv = document.querySelector("#parent")

    const getTasks = () => {
        fetch(taskUrl)
        .then(response => response.json())
        .then(tasks => initialRenderTasks(tasks))
    }
    
    const initialRenderTasks = (tasks) => {
        renderTable(tasks)
        // console.log(tasks)
        for (task of tasks){
          let taskDesc = task.description
          let taskName = task.taskname
          let taskDate = task.date
          let taskPom = task.pomodoro
          let taskId = task.id
          // let today = new Date().toISOString().split('T')[0]
          let today = createDate(0)
          let formattedDate = new Date(today).toISOString().split('T')[0]
          // debugger
          taskHeader.innerText = `Tasks for the day: ${taskDate}`
          // debugger
            if(formattedDate === taskDate){
            renderList(taskName, taskDesc, taskId, taskDate, taskPom)
            } 
        }   
    }

    const renderCalendarTasks = (tasks, date) => {
        //find the date selected and render tasks
        listTitleUl.innerHTML = ""
        //tasks.filter then forEach (map in react)
        tasks.forEach(task => {
          let clickedDate = `2020-09-${date}`
          let formattedDate = new Date(clickedDate).toISOString().split('T')[0]
          let taskDate = task.date
          if(formattedDate === taskDate){

            taskHeader.innerText = `Tasks for the day: ${taskDate}`
            let taskDesc = task.description
            let taskName = task.taskname
            let taskPom = task.pomodoro
            let taskId = task.id
            renderList(taskName, taskDesc, taskId, taskDate, taskPom)
             } 
        })   
    }

    const renderList = (taskName, taskDesc, taskId, taskDate, taskPom) => {
        const taskLi = document.createElement("li")
        taskLi.className = "taskli"
        taskLi.dataset.pomodoro = taskPom
        taskLi.dataset.id = taskId
        taskLi.innerText = `${taskName} - ${taskDesc} (${taskPom} Pomodoro)`
        listTitleUl.appendChild(taskLi)
    }

    const renderTable = (tasks) => {
      document.querySelectorAll('.day')[0].innerText = createDate(-1)
      document.querySelectorAll('.day')[1].innerText = createDate(-2)
      document.querySelectorAll('.day')[2].innerText = createDate(-3)
      document.querySelectorAll('.day')[3].innerText = createDate(-4)
      document.querySelectorAll('.day')[4].innerText = createDate(-5)
      document.querySelectorAll('.day')[5].innerText = createDate(-6)
      document.querySelectorAll('.day')[6].innerText = createDate(-7)

      

        document.querySelectorAll(".day").forEach( day => {
          let date = day.innerText
          let formattedDate = new Date(date).toISOString().split('T')[0]
          let sum = 0
          for (task of tasks){

            let taskDate = task.date
            let taskPom = task.pomodoro
            let taskStatus = task.status

            if (formattedDate === taskDate && taskStatus === true){
              
              sum += parseInt(taskPom)

              //sum = sum of taskPom for date with true status
              //"🍅".repeat(3)
              //document.querySelectorAll('.day')[0].nextElementSibling
            }
          }
          day.nextElementSibling.innerText = "🍅".repeat(sum)
      })
    }
    // "🍅".repeat(2)

    const createDate = (daysToAdd) => {
      let today = new Date()
      today.setDate(today.getDate() + daysToAdd)
      let dd = today.getDate()
      let mm = today.getMonth() + 1
      let y = today.getFullYear()

      let someFormattedDate = y + '-'+ mm + '-'+ dd;
      return someFormattedDate
    }
//Calendar >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    function createCalendar(elem, year, month) {

        let mon = month - 1; // months in JS are 0..11, not 1..12
        let d = new Date(year, mon);
  
        let table = '<table align="center" class="calendar" width="400" height="250" border="1"><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';
  
        // spaces for the first row
        // from Monday till the first day of the month
        for (let i = 0; i < getDay(d); i++) {
          table += '<td></td>';
        }
  
        // <td> with actual dates
        while (d.getMonth() == mon) {
          table += '<td class="calendar-date" align="center">' + d.getDate() + '</td>';
  
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
        if(e.target.className === "calendar-date"){

            let clickedDate = e.target.innerText
            
            fetch(taskUrl)
            .then(response => response.json())
            .then(tasks => renderCalendarTasks(tasks, clickedDate))
        }
        if(e.target.className === "taskli"){
          parentDiv.innerHTML = ""
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