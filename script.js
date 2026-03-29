// ===============================
// USER REGISTER FUNCTION
// ===============================
function register(event) {
    event.preventDefault();

    let username = document.getElementById("newUser").value.trim();
    let password = document.getElementById("newPass").value.trim();

    if (username === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
        alert("User already exists!");
        return;
    }

    users[username] = password;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    window.location.href = "index.html";
}


// ===============================
// USER LOGIN FUNCTION
// ===============================
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username] === password) {

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", username);

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
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}


// ===============================
// CHECK LOGIN & SHOW USERNAME
// ===============================
function checkLoginAndShowUser() {

    let isLoggedIn = localStorage.getItem("loggedIn");
    let user = localStorage.getItem("currentUser");

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
// store all answers of user
let userAnswers = [];
let currentQuestion = 0;
let score = 0;

// Get selected module
let module = localStorage.getItem("module");

// Filter questions based on module
if (!quizData || !module) {
    console.log("Quiz data or module missing");
}
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
let options = document.getElementsByName("answer");
for (let i = 0; i < options.length; i++) {
    options[i].checked = false;
}

let solutionText = document.getElementById("solutionText");
if (solutionText) solutionText.style.display = "none";
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

        let q = filtered[currentQuestion];

        // store user answer
        userAnswers.push({
            question: q.question,
            correct: q.correct,
            selected: answer,
            options: q
        });

        // check score
        if (answer === q.correct) {
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

    let user = localStorage.getItem("currentUser");

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
        "<button onclick='showReview()' class='greenbtn'>Review Answers</button>" +
        "<button onclick='location=\"module.html\"' class='back-btn'>Back</button>";
}


// ===============================
// PERFORMANCE PAGE
// ===============================
if (document.getElementById("resultData")) {

    let user = localStorage.getItem("currentUser");
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

// ===============================
// VIEW SOLUTION
// ===============================
let solutionBtn = document.getElementById("solutionBtn");
if (solutionBtn) {
    solutionBtn.onclick = function () {

        let q = filtered[currentQuestion];

        let correctAnswer = q[q.correct];

        let box = document.getElementById("solutionText");

        box.style.display = "block";
        box.innerText = "Correct Answer: " + correctAnswer;
    };
}

// ===============================
// REVIEW PAGE
// ===============================
function showReview() {

    let html = "<h2>Review Answers</h2><hr class='divider'>";

    for (let i = 0; i < userAnswers.length; i++) {

        let item = userAnswers[i];

        let correctText = escapeHTML(item.options[item.correct]);
        let selectedText = escapeHTML(item.options[item.selected]);

        html += "<p><b>Q" + (i + 1) + ":</b> " + item.question + "</p>";

        if (item.selected === item.correct) {
            html += "<p style='color:green;'>Your Answer: " + selectedText + "</p>";
        } else {
            html += "<p style='color:red;'>Your Answer: " + selectedText + "</p>";
        }

        html += "<p>Correct Answer: " + correctText + "</p>";
        html += "<hr>";
    }

    html += "<button onclick='location=\"module.html\"' class='back-btn'>Back</button>";

    document.querySelector(".quiz-container").innerHTML = html;
}

// ===============================
// get selected answer
// ===============================
function getSelectedAnswer() {

    let options = document.getElementsByName("answer");

    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return options[i].value;
        }
    }

    return null;
}

// ===============================
// covert html tags
// ===============================
function escapeHTML(text) {
    return text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}