document.getElementById("taskFilter").addEventListener("change", filterTasks);


//filter tasks

async function filterTasks() {
    const filterValue = document.getElementById("taskFilter").value;
    console.log("Fetching tasks from API...");

    const token = localStorage.getItem("token"); // Get token from localStorage

    try {
        let response = await fetch("http://localhost:7000/tasks", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send token
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        let tasks = await response.json();
        console.log("Tasks received:", tasks);

        // Apply filtering
        if (filterValue !== "all") {
            tasks = tasks.filter(task => task.category === filterValue
            );
        }

        displayTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear previous tasks

    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.id = `task-${task._id}`;
        taskElement.innerHTML = `<p>${task.description} - ${task.completed ? "Completed" : "Pending"}</p>
         ${!task.completed ? `<button onclick="completeTask('${task._id}')">Complete Task</button>` : ""}
         ${task.completed && task.completedBy === loggedInUserId ? `<button onclick="openRatingModal('${task._id}')">Rate User</button>` : ""}
         `;
        taskList.appendChild(taskElement);
    });
}

async function createTask() {
    const description = document.getElementById("taskRequestInput").value;
    const category = document.getElementById("taskCategory").value;
    const token = localStorage.getItem("token");

    if (!description) {
        alert("Please enter a task and credits.");
        return;
    }

    if (!token) {
        alert("You must be logged in to create tasks.");
        return;
    }

    try {
        const response = await fetch("http://localhost:7000/tasks/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ description, category })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Task created successfully!");
            document.getElementById("taskRequestInput").value = "";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
}


async function completeTask(taskId) {
    const token = localStorage.getItem("token"); // Get user token

    if (!token) {
        alert("You need to log in first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:7000/tasks/complete/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Send token for authentication
            },
            body: JSON.stringify({ userId: "userId_here" }) // Replace with actual user ID
        });

        const result = await response.json();
        if (response.ok) {
            alert("Task marked as completed!");
            filterTasks(); // Refresh the task list
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Error completing task:", error);
    }
}

function openRatingModal(taskId) {
    const taskElement = document.getElementById(`task-${taskId}`);

    if (!taskElement) return;

    // Check if rating input already exists
    if (taskElement.querySelector(".rating-input")) return;

    // Create input field and submit button
    const ratingInput = document.createElement("input");
    ratingInput.type = "number";
    ratingInput.min = "1";
    ratingInput.max = "5";
    ratingInput.placeholder = "Enter rating (1-5)";
    ratingInput.className = "rating-input";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Rating";
    submitButton.onclick = () => submitRating(taskId, ratingInput.value);

    taskElement.appendChild(ratingInput);
    taskElement.appendChild(submitButton);
}

async function submitRating(taskId, rating) {
    if (!rating || rating < 1 || rating > 5) {
        alert("Please enter a valid rating between 1 and 5.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:7000/users/rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ taskId, rating })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Rating submitted successfully!");
            location.reload(); // Refresh to reflect rating
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error submitting rating:", error);
    }
}
