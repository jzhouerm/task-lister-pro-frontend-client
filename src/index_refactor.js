document.addEventListener("DOMContentLoaded", e => {
    let addTask = true;

    const taskUrl = "http://localhost:3000/tasks/"
    // const userUrl = "http://localhost:3000/users/1"
    const taskForm = document.querySelector(".add-task-form") //reset form
    const addBtn = document.querySelector("#new-task-btn")
    const taskFormContainer = document.querySelector(".container");
    taskFormContainer.style.display = "none"
    const listTitleUl = document.querySelector(".list-title")
    const calendarDiv = document.querySelector("#node8")
    const taskHeader = document.querySelector(".taskheader")
    const parentDiv = document.querySelector("#parent")
    const parentTimerDiv = document.querySelector("#parent-timer")
    const timerName = document.querySelector('.timer-name')
    const timerDesc = document.querySelector(".timer-description")
    const createTaskDiv = document.getElementById("node13")

    const getTasks = () => {
        fetch(taskUrl)
        .then(response => response.json())
        .then(tasks => initialRenderTasks(tasks))
    }
    
    const initialRenderTasks = (tasks) => {
        renderTable(tasks)
        listTitleUl.innerHTML = ""
        for (task of tasks){
          let today = createDate(0)
          let formattedDate = new Date(today).toISOString().split('T')[0]
          taskHeader.innerText = `Tasks for the day: ${formattedDate}`
            if(formattedDate === taskDate){
            renderList(task)
            } 
        }   
    }

    const renderCalendarTasks = (tasks, date) => {
        listTitleUl.innerHTML = ""   
        tasks.forEach(task => {
          let clickedDate = `2020-09-${date}`
          let formattedDate = new Date(clickedDate).toISOString().split('T')[0]
          let taskDate = task.date
          if(formattedDate === taskDate){
            taskHeader.innerText = `Tasks for the day: ${taskDate}`
            renderList(task)
             } 
        })   
    }

    const renderList = (task) => {
        const taskLi = document.createElement("li")
        const { taskPom, taskId, taskStatus, taskDesc, taskName } = task 
        taskLi.className = "taskli"
        taskLi.dataset.pomodoro = taskPom
        taskLi.dataset.id = taskId
        taskLi.dataset.status = taskStatus
        taskLi.dataset.description = taskDesc
        taskLi.innerText = `${taskName} - ${taskDesc} (${taskPom} 🍅)`
        if (taskStatus === "true"){
          let text = taskLi.textContent
          taskLi.textContent = text + "  ✅"
        }
        listTitleUl.appendChild(taskLi)
    }

    const renderTable = (tasks) => { //table for last 7 days
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
            }
          }
          day.nextElementSibling.innerText = "🍅".repeat(sum)
      })

    }

    const createDate = (daysToAdd) => {
      let today = new Date()
      today.setDate(today.getDate() + daysToAdd)
      let dd = today.getDate()
      let mm = today.getMonth() + 1
      let y = today.getFullYear()

      let someFormattedDate = y + '-'+ mm + '-'+ dd;
      return someFormattedDate
    }

        
        const FULL_DASH_ARRAY = 283;
        const WARNING_THRESHOLD = 10;
        const ALERT_THRESHOLD = 5;

        const COLOR_CODES = {
          info: {
            color: "green"
          },
          warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
          },
          alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
          }
        };
        //upon click on taskLi, the time is set to taskpom * 1500
        // const TIME_LIMIT = parseInt(document.querySelector("#node2").dataset.pom)*1500
        const TIME_LIMIT = 1500 
        // let TIME_LIMIT = pomTimeConverter; 
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;
        let remainingPathColor = COLOR_CODES.info.color;   

        const formatTime = (time) => {
          const minutes = Math.floor(time / 60);
          let seconds = time % 60;

          if (seconds < 10) {
            seconds = `0${seconds}`;
          }

          return `${minutes}:${seconds}`;
        }

        const onTimesUp = () => {
          clearInterval(timerInterval);
        }

        
        const startTimer = (taskId, taskPom, taskName) => {
          timerName.textContent = `${taskName}`
          timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed; 
            document.getElementById("base-timer-label").innerHTML = formatTime(
              timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
              onTimesUp();
            }
          }, 1000);
        }

        const setRemainingPathColor = (timeLeft) => {
          const { alert, warning, info } = COLOR_CODES;
          if (timeLeft <= alert.threshold) {
            document
              .getElementById("base-timer-path-remaining")
              .classList.remove(warning.color);
            document
              .getElementById("base-timer-path-remaining")
              .classList.add(alert.color);
          } else if (timeLeft <= warning.threshold) {
            document
              .getElementById("base-timer-path-remaining")
              .classList.remove(info.color);
            document
              .getElementById("base-timer-path-remaining")
              .classList.add(warning.color);
          }
        }

        const calculateTimeFraction = () => {
          const rawTimeFraction = timeLeft / TIME_LIMIT;
          return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        }

        const setCircleDasharray = () => {
          const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
          ).toFixed(0)} 283`;
          document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
        }
  // } //end of timerHandler

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
        if(e.target.className === "taskli" && e.target.dataset.status === "false"){

          timerName.textContent = "Current Task:"
          timerDesc.textContent = ` • ${e.target.textContent}`                       
          parentDiv.style.display = "none"
          const appDiv = document.createElement("div")
          appDiv.className = "app"
          parentTimerDiv.append(appDiv)
          appDiv.innerHTML = `
            <div class="base-timer">
              <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                  <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                  <path
                  id="base-timer-path-remaining"
                  stroke-dasharray="283"
                  class="base-timer__path-remaining ${remainingPathColor}"
                  d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                  "
                  ></path>
                  
                </g>
              </svg>
              <span id="base-timer-label" class="base-timer__label">${formatTime(
                timeLeft
              )}</span>
            </div>
            `;

          createTaskDiv.style.display = "none"
          let taskId = e.target.dataset.id
          let taskPom = e.target.dataset.pomodoro
          let taskName = e.target.textContent
          let taskStatus = e.target.dataset.status
          let startBtn = document.createElement("button")
          startBtn.className = "start-btn"
          startBtn.textContent = "Start"
          let baseTimer = document.querySelector(".base-timer")
          baseTimer.append(startBtn)
          startBtn.dataset.id = taskId
          startBtn.dataset.pom = taskPom
          startBtn.dataset.name = taskName
          let completedBtn = document.createElement("button")
          completedBtn.className = "complete-btn"
          completedBtn.textContent = "Completed!"
          completedBtn.dataset.id = taskId
          completedBtn.dataset.status = taskStatus
          baseTimer.append(completedBtn)
          document.querySelector("#node2").dataset.pom = e.target.dataset.pomodoro
        }
          if (e.target === document.querySelector(".start-btn")){
            let taskId = e.target.dataset.id
            let taskPom = e.target.dataset.pom
            let taskName = e.target.name
            startTimer(taskId, taskPom, taskName);
          }
          if (e.target === document.querySelector(".complete-btn")) {
            let taskId = e.target.dataset.id

            const configObj = {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
                "accept": "application/json"
              },
              body: JSON.stringify({status: true})
            }
            
            fetch(taskUrl + taskId, configObj)
            .then(response => response.json())
            .then(data => {
              parentTimerDiv.style.display = "none"   //hide
              timerName.style.display = "none"
              parentDiv.style.display = "block"    //show
              createTaskDiv.style.display = "block"
              getTasks()
            })
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
                .then(data => {
                  getTasks()
                  taskForm.reset()
                })
        }
    })

//invoke functions
getTasks()
createCalendar(calendarDiv, 2020, 9);


})//end of DOMContentLoaded

/*
To-do:

- fix the timer to reflect number of pomodoros
- fix the calendar to view different months
- Logo/title (CSS)
- hover effect
- add new task to iCal
-format form

*/