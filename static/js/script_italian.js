const questions = [
    {
        question: "Which verb means 'to eat' in Italian?",
        answers: [
            { text: "mangiare", correct: true},
            { text: "dormire", correct: false},
            { text: "parlare", correct: false},
        ]
    },
    {
        question: "What does 'grazie' mean in English?",
        answers: [
            { text: "thank you", correct: true},
            { text: "goodbye", correct: false},
            { text: "hello", correct: false},
        ]
    },
    {
        question: "What is the correct translation for 'to travel' in Italian?",
        answers: [
            { text: "andare", correct: false},
            { text: "viaggiare", correct: true},
            { text: "partire", correct: false},
        ]
    },
    {
        question: "How do you say 'I have been studying Italian for five years' in Italian?",
        answers: [
            { text: "Io sono stato studiando italiano per cinque anni.", correct: false},
            { text: "Io ho studiato italiano per cinque anni.", correct: true},
            { text: "Io ho stato studiando italiano per cinque anni.", correct: false},
        ]
    },
    {
        question: "Which of the following words is not derived from Latin in Italian?",
        answers: [
            { text: "cibo (food)", correct: true},
            { text: "aereo (airplane)", correct: false},
            { text: "biblioteca (library)", correct: false},
        ]
    },
    {
        question: "What is the Italian equivalent of the English expression 'to kill two birds with one stone'?",
        answers: [
            { text: "uccidere due conigli con una pietra", correct: false},
            { text: "prendere due lepri con una fava", correct: false},
            { text: "uccidere due uccelli con una pietra", correct: true},
        ]
    },
    {
        question: "Which tense is used to express an action that was happening at a specific point in the past in Italian?",
        answers: [
            { text: "trapassato prossimo", correct: false},
            { text: "passato prossimo", correct: false},
            { text: "imperfetto", correct: true},
        ]
    },
    {
        question: "What is the correct translation for 'to remember' in Italian?",
        answers: [
            { text: "imparare", correct: false},
            { text: "ricordare", correct: true},
            { text: "dimenticare", correct: false},
        ]
    },
    {
        question: "Which preposition is used with the verb 'aspettare' to mean 'to wait for' in Italian?",
        answers: [
            { text: "per", correct: true},
            { text: "a", correct: false},
            { text: "da", correct: false},
        ]
    },
    {
        question: "What is the correct translation for 'thank you very much' in Italian?",
        answers: [
            { text: "grazie mille", correct: true},
            { text: "mi dispiace", correct: false},
            { text: "per favore", correct: false},
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
        message = "Accepted";
    } else {
        message = "Rejected";
    }
    questionElement.innerHTML = `Thank you for attempting the quiz. You may exit the quiz now.<br>You scored ${score} out of ${questions.length}!<br>${message}`;
    nextButton.innerHTML = "Exit";
    nextButton.style.display = "block";
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