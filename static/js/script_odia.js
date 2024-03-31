const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Odia word for 'hello'?",
        answers: [
            { text: "ନମସ୍କାର (namaskara)", correct: true},
            { text: "କେମିତି ଅଛନ୍ତି? (kemitia achhanti)", correct: false},
            { text: "ନମସ୍ତେ (namaste)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'thank you' in Odia?",
        answers: [
            { text: "ଧନ୍ୟବାଦ (dhanyabad)", correct: true},
            { text: "କୃତଜ୍ଞତା (krutagnata)", correct: false},
            { text: "ଧନ୍ୟବାଦ କରିବା (dhanyabad kariba)", correct: false},
        ]
    },
    {
        question: "What does 'କେମିତି ଅଛନ୍ତି?' (kemitia achhanti) mean in English?",
        answers: [
            { text: "Thank you", correct: false},
            { text: "How are you?", correct: true},
            { text: "Please", correct: false},
        ]
    },
    {
        question: "How do you say 'goodbye' in Odia?",
        answers: [
            { text: "କାଲେ ମିଳିବା (kale miliba)", correct: false},
            { text: "ବାଇ (bai)", correct: true},
            { text: "ପୁଣି ଦେଖିବା (puni dekhiba)", correct: false},
        ]
    },
    {
        question: "Which phrase means 'What is your name?' in Odia?",
        answers: [
            { text: "ତୁମାର ନାଁ କେନ୍ଦ୍ର? (tumara naanka?)", correct: true},
            { text: "ତମର ନାଁ କେନ୍ଦ୍ର? (tomara naanka?)", correct: false},
            { text: "ଆପଣଙ୍କ ନାଁ କେନ୍ଦ୍ର? (apananka naanka?)", correct: false},
        ]
    },
    {
        question: "How do you say 'to sleep' in Odia?",
        answers: [
            { text: "ଖେଳିବା (kheliba)", correct: false},
            { text: "ପାଇବା (paiba)", correct: false},
            { text: "ଘୁମିବା (ghumiba)", correct: true},
        ]
    },
    {
        question: "Which phrase means 'What is your age?' in Odia?",
        answers: [
            { text: "ଏହିଦିନ କେମିତି ହେଲା? (ehidina kemitia hela?)", correct: false},
            { text: "ଆପଣଙ୍କ ବୟ କତ? (apananka bhaya kata?)", correct: false},
            { text: "ତମର ବୟ କତ? (tomara bhaya kata?)", correct: true},
        ]
    },
    {
        question: "How do you say 'to write' in Odia?",
        answers: [
            { text: "ପଢ଼ିବା (padhiba)", correct: false},
            { text: "ଲିଖିବା (likhiba)", correct: true},
            { text: "ମାନୁହୁଣୀ (manuhuni)", correct: false},
        ]
    },
    {
        question: "What does 'ଖୁସି' mean in English?",
        answers: [
            { text: "Happiness", correct: true},
            { text: "Sadness", correct: false},
            { text: "Surprise", correct: false},
        ]
    },
    {
        question: "Which phrase means 'Where are you going?' in Odia?",
        answers: [
            { text: "ତୁମର କୁଥିରେ ଯାନ୍ତି? (tumara kuthire yanthi?)", correct: true},
            { text: "ତୁମର ଯାନ୍ତି? (tumara yanthi?)", correct: false},
            { text: "ତୁମର କୁହାନ୍ତି? (tumara kuhanthi?)", correct: false},
        ]
    },

];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentquestionindex = 0;
let score = 0;

function startQuiz(){
    currentquestionindex=0;
    score=0;
    nextButton.innerHTML="Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentquestion=questions[currentquestionindex];
    let questionNo=currentquestionindex+1;
    questionElement.innerHTML=questionNo+". "+currentquestion.question;

    currentquestion.answers.forEach(answer => {
        const button=document.createElement("button");
        button.innerHTML=answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct=answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}


function resetState(){
    nextButton.style.display="none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn=e.target;
    const isCorrect=selectedBtn.dataset.correct==="true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    let message = "";
    if (score >= 8) {
        message = "<br><span style='color: green; font-size: small;'>We are pleased to inform you that you have been selected to teach. Your proficiency in this language meet our standards, and we believe you will be an excellent addition to our team of instructors.</span>";
    } else {
        message = "<br><span style='color: red; font-size: small;'>We regret to inform you that we are unable to offer you to teach at this time, as our instructors must meet specific proficiency standards which you do not currently fulfill.</span>";
    }
    message += "<br><br>You may close the tab now";
    questionElement.innerHTML = `Thank you for attempting the quiz.<br>You scored ${score} out of ${questions.length}!<br>${message}`;

    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'Odia',
            'score': score,
        },
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrftoken  // Include CSRF token in headers
        }
    })
}


function handleNextButton(){
    currentquestionindex++;
    if(currentquestionindex<questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentquestionindex < questions.length) {
        handleNextButton();
    } else {
        // Instead of starting the quiz again, go back to the previous page
        history.back();
    }
});

startQuiz();