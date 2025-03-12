//Fetch API

fetch("https://localhost/7000/tasks")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error("Error fetching tasks:", error));

//task filter

document.getElementById("taskList").addEventListener("change", (event) => {
    const category = event.target.value;
    fetch(`http://localhost:7000/tasks?category=${category}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error("Error filtering tasks:", error));
})