// ===============================
// REGISTER
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
// LOGIN
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
// CHECK LOGIN & SHOW USER
// ===============================
function checkLoginAndShowUser() {
    let isLoggedIn = localStorage.getItem("loggedIn");
    let user = localStorage.getItem("currentUser");

    if (isLoggedIn !== "true") {
        // Session expired, redirect to login page
        window.location.href = "index.html";
        return;
    }

    // Show welcome message
    let welcome = document.getElementById("welcome");
    if (welcome) {
        welcome.innerText = "Welcome, " + user;
    }
}

if (document.getElementById("welcome")) {
    checkLoginAndShowUser();
}

// ===============================
// START QUIZ (MODULE + SET)
// ===============================
function startQuiz(moduleCode, setCode) {

    localStorage.setItem("module", moduleCode);
    localStorage.setItem("set", setCode);

    window.location.href = "quiz.html";
}

// ===============================
// NAVIGATION
// ===============================
function logout() {
    // Expire session only
    localStorage.removeItem("loggedIn");  // session expired
    localStorage.removeItem("module");    // clear selected module
    localStorage.removeItem("set");       // clear selected set

    // Keep currentUser so it can be remembered
    window.location.href = "index.html";
}

function viewPerformance() {
    window.location.href = "performance.html";
}

// ===============================
// MODULE NAMES
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
let module = localStorage.getItem("module");
let set = localStorage.getItem("set");

// Filter questions
let filtered = (typeof quizData !== "undefined")
    ? quizData.filter(q => q.module === module && q.set === set)
    : [];

if (filtered.length === 0) {
    console.log("No questions found");
}

// Variables
let currentQuestion = 0;
let score = 0;
let userAnswers = [];

// ===============================
// LOAD QUESTION
// ===============================
function loadQuestion() {

    let q = filtered[currentQuestion];

    document.getElementById("moduleName").innerText =
        moduleNames[module] + " - " + set;

    document.getElementById("question").innerText = q.question;

    document.getElementById("a").innerText = q.a;
    document.getElementById("b").innerText = q.b;
    document.getElementById("c").innerText = q.c;
    document.getElementById("d").innerText = q.d;

    // Chapter name
    let key = module + "-" + q.chapter;
    document.getElementById("chapter").innerText =
        "Chapter: " + (chapterNames[key] || q.chapter);

    document.getElementById("progress").innerText =
        "Question " + (currentQuestion + 1) + "/" + filtered.length;

    // Clear selection
    document.querySelectorAll('input[name="answer"]').forEach(o => o.checked = false);

    // Hide solution
    let box = document.getElementById("solutionText");
    if (box) box.style.display = "none";
}

// ===============================
// GET SELECTED ANSWER
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
// NEXT BUTTON
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

        // Store answer
        userAnswers.push({
            question: q.question,
            correct: q.correct,
            selected: answer,
            options: q
        });

        // Score check
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

    let results = JSON.parse(localStorage.getItem("results")) || {};

    if (!results[user]) results[user] = {};
    if (!results[user][module]) results[user][module] = {};

    results[user][module][set] = score;

    localStorage.setItem("results", JSON.stringify(results));

   let percent = Math.round((score / filtered.length) * 100);

// Grade logic
let grade = "C";
let color = "#ef4444"; // red

if (percent >= 70) {
    grade = "A";
    color = "#22c55e"; // green
} else if (percent >= 40) {
    grade = "B";
    color = "#f59e0b"; // yellow
}

document.querySelector(".quiz-box").innerHTML =
    `<h3>${moduleNames[module]} - ${set}</h3>
     <hr class="divider">

     <div class="score-circle" style="background:${color}">
        ${grade}
     </div>
     <p class="grade-label">Grade</p>
     <p class="score-subtext">
        Score: ${score} / ${filtered.length}
     </p>

     <div class="quiz-buttons">
        <button class="primary-btn" onclick="showReview()">Review Answers</button>
        <button class="secondary-btn" onclick="location='module.html'">Back to Modules</button>
     </div>`;
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

    let html = "<h3>Review Answers</h3><hr class='divider'>";

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

   html += `
<div class="quiz-buttons">
    <button class="secondary-btn" onclick="location='module.html'">Back to Modules</button>
</div>`;

    document.querySelector(".quiz-box").innerHTML = html;
}

// ===============================
// ESCAPE HTML (IMPORTANT FIX)
// ===============================
function escapeHTML(text) {
    return text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function exitQuiz() {

    let confirmExit = confirm("Are you sure you want to exit the quiz?");

    if (confirmExit) {
        window.location.href = "module.html";
    }
}

// ===============================
// PERFORMANCE PAGE (GROUPED)
// ===============================
if (document.getElementById("resultData")) {

    let user = localStorage.getItem("currentUser");
    let allResults = JSON.parse(localStorage.getItem("results")) || {};
    let data = allResults[user];

    let output = "";

    if (data) {

        for (let m in data) {

            output += `
            <div class="module-card">
                <h3>${moduleNames[m]}</h3>
                <div class="set-list">`;

            for (let s in data[m]) {

                let score = data[m][s];

let actualTotal = quizData.filter(q => q.module === m && q.set === s).length;

// Use 100 if full set, else actual
let total = actualTotal < 100 ? actualTotal : 100;

let percent = Math.round((score / total) * 100);
let grade = "C";
if (percent >= 70) grade = "A";
else if (percent >= 40) grade = "B";

                output += `
                <div class="set-row">
                    <div>
                        <strong>${s}</strong><br>
                        Score: ${score}/${total}
                    </div>
                    <div class="grade ${grade}">
                        ${grade}
                    </div>
                </div>`;
            }

            output += `
                </div>
            </div>`;
        }

    } else {
        output = "<p>No performance data available</p>";
    }

    document.getElementById("resultData").innerHTML = output;
}