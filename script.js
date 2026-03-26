// ===============================
// USER REGISTER FUNCTION
// ===============================
function register(event) {
    event.preventDefault(); // stop form reload

    let username = document.getElementById("newUser").value;
    let password = document.getElementById("newPass").value;

    // Save user data in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    alert("Registration Successful!");

    // Redirect to login page
    window.location.href = "index.html";
}


// ===============================
// USER LOGIN FUNCTION
// ===============================
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let storedUser = localStorage.getItem("username");
    let storedPass = localStorage.getItem("password");

    // Check username & password
    if (username === storedUser && password === storedPass) {

        // Save login session
        localStorage.setItem("loggedIn", "true");

        alert("Login Successful!");

        window.location.href = "module.html";

    } else {
        alert("Invalid Username or Password");
    }
}


// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
    localStorage.removeItem("loggedIn"); // remove session
    window.location.href = "index.html";
}


// ===============================
// CHECK LOGIN & SHOW USERNAME
// ===============================
function checkLoginAndShowUser() {

    let isLoggedIn = localStorage.getItem("loggedIn");
    let user = localStorage.getItem("username");

    // If not logged in → go to login page
    if (isLoggedIn !== "true") {
        window.location.href = "index.html";
        return;
    }

    // Show username on screen
    let welcomeText = document.getElementById("welcome");

    if (welcomeText) {
        welcomeText.innerText = "Welcome, " + user;
    }
}


// Run this on pages where username is shown
if (document.getElementById("welcome")) {
    checkLoginAndShowUser();
}


// ===============================
// MODULE SELECTION
// ===============================
function startQuiz(moduleCode) {

    // Save selected module
    localStorage.setItem("module", moduleCode);

    // Go to quiz page
    window.location.href = "quiz.html";
}


// ===============================
// NAVIGATION
// ===============================
function viewPerformance() {
    window.location.href = "performance.html";
}

function goBack() {
    window.location.href = "module.html";
}


// ===============================
// MODULE FULL NAMES
// ===============================
const moduleNames = {
    "M1": "M1-R5.1: Information Technology Tools and Network Basics",
    "M2": "M2-R5.1: Web Designing & Publishing",
    "M3": "M3-R5.1: Programming and Problem Solving through Python",
    "M4": "M4-R5.1: Internet of Things and its Applications"
};


// ===============================
// CHAPTER NAMES
// ===============================
const chapterNames = {
    "M1-Ch1": "Introduction to Computer & Operating System",
    "M1-Ch2": "Word Processing",
    "M1-Ch3": "Spreadsheet",
    "M1-Ch4": "Presentation",
    "M1-Ch5": "Internet, WWW, E-mail & e-Governance",
    "M1-Ch6": "Digital Financial Tools & Cyber Security",

    "M2-Ch1": "Web Design & HTML Basics",
    "M2-Ch2": "Cascading Style Sheets (CSS)",
    "M2-Ch3": "CSS Framework",
    "M2-Ch4": "JavaScript & AngularJS",
    "M2-Ch5": "Photo Editing & Web Publishing",

    "M3-Ch1": "Programming, Algorithm & Flowcharts",
    "M3-Ch2": "Python Basics & Data Types",
    "M3-Ch3": "Functions, File Handling & Modules",
    "M3-Ch4": "NumPy Basics",

    "M4-Ch1": "IoT Introduction & Communication Model",
    "M4-Ch2": "Things & Connections",
    "M4-Ch3": "Sensors & Microcontrollers",
    "M4-Ch4": "Building IoT Applications",
    "M4-Ch5": "IoT Security & Future",
    "M4-Ch6": "Soft Skills & Personality Development"
};


// ===============================
// QUIZ VARIABLES
// ===============================
let currentQuestion = 0;
let score = 0;

// Get selected module
let module = localStorage.getItem("module");

// Filter questions based on module
let filtered = quizData.filter(q => q.module === module);


// ===============================
// LOAD QUESTION
// ===============================
function loadQuestion() {

    let q = filtered[currentQuestion];

    document.getElementById("question").innerText = q.question;
    document.getElementById("a").innerText = q.a;
    document.getElementById("b").innerText = q.b;
    document.getElementById("c").innerText = q.c;
    document.getElementById("d").innerText = q.d;

    // Show module name
    document.getElementById("moduleName").innerText = moduleNames[module];

    // Show chapter name
    let key = module + "-" + q.chapter;
    document.getElementById("chapter").innerText = "Chapter: " + chapterNames[key];

    // Show progress
    document.getElementById("progress").innerText =
        "Question " + (currentQuestion + 1) + "/" + filtered.length;

    // Clear previous selection
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.checked = false;
    });
}


// ===============================
// GET SELECTED ANSWER
// ===============================
function getSelectedAnswer() {

    let answers = document.querySelectorAll('input[name="answer"]');
    let selected = null;

    answers.forEach(ans => {
        if (ans.checked) {
            selected = ans.value;
        }
    });

    return selected;
}


// ===============================
// NEXT BUTTON LOGIC
// ===============================
if (document.getElementById("next")) {

    loadQuestion();

    document.getElementById("next").onclick = function () {

        let answer = getSelectedAnswer();

        if (!answer) {
            alert("Please select an answer");
            return;
        }

        // Check correct answer
        if (answer === filtered[currentQuestion].correct) {
            score++;
        }

        currentQuestion++;

        if (currentQuestion < filtered.length) {
            loadQuestion();
        } else {
            showResult();
        }
    };
}


// ===============================
// SHOW RESULT
// ===============================
function showResult() {

    let user = localStorage.getItem("username");

    let allResults = JSON.parse(localStorage.getItem("results")) || {};

    if (!allResults[user]) {
        allResults[user] = {};
    }

    allResults[user][module] = score;

    localStorage.setItem("results", JSON.stringify(allResults));

    document.querySelector(".quiz-container").innerHTML =
        "<h2>" + moduleNames[module] + "</h2>" +
        "<hr class='divider'>" +
        "<h2>Your Score: " + score + " / " + filtered.length + "</h2>" +
        "<button onclick='location=\"module.html\"'>Back</button>";
}


// ===============================
// PERFORMANCE PAGE
// ===============================
if (document.getElementById("resultData")) {

    let user = localStorage.getItem("username");
    let allResults = JSON.parse(localStorage.getItem("results")) || {};
    let data = allResults[user];

    let output = "";

    if (data) {

        for (let m in data) {

            let score = data[m];
            let total = quizData.filter(q => q.module === m).length;

            let percent = Math.round((score / total) * 100);

            let grade = "C";
            if (percent >= 70) grade = "A";
            else if (percent >= 40) grade = "B";

            output += `
            <div class="performance-card">
                <div class="card-content">
                    <h4>${moduleNames[m]}</h4>
                    <p class="score-line">
                        Score: ${score}/${total} | Percentage: ${percent}%
                    </p>
                </div>
                <div class="grade ${grade}">
                    ${grade}
                </div>
            </div>`;
        }

    } else {
        output = "<p>No performance data available</p>";
    }

    document.getElementById("resultData").innerHTML = output;
}