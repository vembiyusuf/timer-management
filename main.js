let tasks = [];
let timerInterval;
let currentTask = null;
let countdownTime = 0;

function addTask() {
    let taskName = document.getElementById("taskName").value;
    let taskTime = document.getElementById("taskTime").value;

    if (taskName === "" || taskTime === "" || taskTime <= 0) {
        alert("Masukkan nama tugas dan durasi yang valid!");
        return;
    }

    let task = { id: Date.now(), name: taskName, time: taskTime };
    tasks.push(task);
    document.getElementById("taskName").value = "";
    document.getElementById("taskTime").value = "";
    renderTasks();
}

function renderTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${task.name} - ${task.time} menit</span>
            <div>
                <button class="start" onclick="startTask(${task.id})">Mulai</button>
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Hapus</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function editTask(id) {
    let task = tasks.find(t => t.id === id);
    if (task) {
        let newName = prompt("Edit Nama Tugas:", task.name);
        let newTime = prompt("Edit Durasi (menit):", task.time);
        
        if (newName && newTime > 0) {
            task.name = newName;
            task.time = newTime;
            renderTasks();
        } else {
            alert("Masukkan nilai yang valid!");
        }
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function startTask(id) {
    currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;

    document.getElementById("timer").classList.remove("hidden");
    document.getElementById("timerTaskName").innerText = currentTask.name;
    countdownTime = currentTask.time * 60;

    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (countdownTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").classList.add("hidden");
        speak("Waktu tugas telah habis!");
        return;
    }

    countdownTime--;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = Math.floor(countdownTime / 60);
    let seconds = countdownTime % 60;
    document.getElementById("timeRemaining").innerText = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById("timer").classList.add("hidden");
}

function speak(text) {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "id-ID";
    speech.text = text;
    speech.volume = 1.0;  
    speech.rate = 1;     
    speech.pitch = 1;     
    window.speechSynthesis.speak(speech);
}
