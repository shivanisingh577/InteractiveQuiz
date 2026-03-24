// -----------------------------
// QUIZ DATA (Questions & Answers)
// -----------------------------
const quizData = [
    {
        question: "What is HTML?",
        a: "Programming Language",
        b: "Markup Language",
        c: "Database",
        d: "Operating System",
        correct: "b"
    },
    {
        question: "Which tag is used for CSS?",
        a: "<script>",
        b: "<style>",
        c: "<css>",
        d: "<link>",
        correct: "b"
    },
    {
        question: "Which is used for JavaScript?",
        a: "<script>",
        b: "<js>",
        c: "<javascript>",
        d: "<code>",
        correct: "a"
    }
];


// -----------------------------
// SELECTING HTML ELEMENTS
// -----------------------------
const questionEl = document.getElementById("question");
const answerEls = document.querySelectorAll(".answer");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const progressEl = document.getElementById("progress");


// -----------------------------
// VARIABLES (CONTROL FLOW)
// -----------------------------
let currentQuestion = 0;   // which question is running
let score = 0;             // user score
let answered = false;      // check if user already answered


// -----------------------------
// LOAD FIRST QUESTION
// -----------------------------
loadQuiz();


// -----------------------------
// FUNCTION: LOAD QUESTION
// -----------------------------
function loadQuiz() {

    // remove previous selection
    deselectAnswers();

    // get current question data
    const currentData = quizData[currentQuestion];

    // update progress text
    progressEl.innerText = "Question " + (currentQuestion + 1) + " / " + quizData.length;

    // show question & options
    questionEl.innerText = currentData.question;
    a_text.innerText = currentData.a;
    b_text.innerText = currentData.b;
    c_text.innerText = currentData.c;
    d_text.innerText = currentData.d;
}


// -----------------------------
// FUNCTION: DESELECT ANSWERS
// -----------------------------
function deselectAnswers() {
    answerEls.forEach(function(answer) {
        answer.checked = false;
    });
}


// -----------------------------
// FUNCTION: GET SELECTED ANSWER
// -----------------------------
function getSelected() {
    let selectedAnswer = null;

    answerEls.forEach(function(answer) {
        if (answer.checked) {
            selectedAnswer = answer.id;
        }
    });

    return selectedAnswer;
}


// -----------------------------
// BUTTON CLICK EVENT
// -----------------------------
submitBtn.addEventListener("click", function () {

    // -------------------------
    // STEP 1: CHECK ANSWER
    // -------------------------
    if (!answered) {

        const selectedAnswer = getSelected();

        // if nothing selected → do nothing
        if (!selectedAnswer) return;

        const correctAnswer = quizData[currentQuestion].correct;

        const options = document.querySelectorAll(".option");

        // loop through all options
        options.forEach(function(option) {

            const input = option.querySelector("input");

            // show correct answer (green)
            if (input.id === correctAnswer) {
                option.classList.add("correct");
            }

            // show wrong answer (red)
            if (input.checked && input.id !== correctAnswer) {
                option.classList.add("wrong");
            }

            // disable all options
            input.disabled = true;
        });

        // increase score if correct
        if (selectedAnswer === correctAnswer) {
            score++;
        }

        // change button text
        submitBtn.innerText = "Next";

        // mark as answered
        answered = true;
    }


    // -------------------------
    // STEP 2: NEXT QUESTION
    // -------------------------
    else {

        currentQuestion++;

        // if more questions available
        if (currentQuestion < quizData.length) {

            loadQuiz();

            // reset styles
            const options = document.querySelectorAll(".option");

            options.forEach(function(option) {
                option.classList.remove("correct", "wrong");

                const input = option.querySelector("input");
                input.disabled = false;
            });

            submitBtn.innerText = "Submit";
            answered = false;
        }

        // -------------------------
        // QUIZ FINISHED
        // -------------------------
        else {
            document.querySelector(".quiz-container").innerHTML =
                "<h2>Your Score: " + score + " / " + quizData.length + "</h2>" +
                "<button onclick='location.reload()'>Restart</button>";
        }
    }
});