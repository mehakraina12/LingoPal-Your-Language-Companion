const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the verb 'to be' in Arabic?",
        answers: [
            { text: "Kana - كان", correct: true},
            { text: "Howa - هو", correct: false},
            { text: "Raqm - رقم", correct: false},
        ]
    },
    {
        question: "What is the definite article 'the' in Arabic?",
        answers: [
            { text: "La - لا", correct: false},
            { text: "Al - ال", correct: true},
            { text: "Ba - با", correct: false},
        ]
    },
    {
        question: "What is the word order in Arabic sentences?",
        answers: [
            { text: "Subject-Verb-Object", correct: false},
            { text: "Verb-Subject-Object", correct: true},
            { text: "Verb-Object-Subject", correct: false},
        ]
    },
    {
        question: "What is the plural form of the word 'kitab' (book - كتاب)?",
        answers: [
            { text: "Kutub - كتب", correct: true},
            { text: "Katabat - كتابات", correct: false},
            { text: "Kitabin - كتابين", correct: false},
        ]
    },
    {
        question: "Which preposition means 'in' or 'at' in Arabic?",
        answers: [
            { text: "Min - من", correct: false},
            { text: "Ila - إلى", correct: false},
            { text: "Fi - في", correct: true},
        ]
    },
    {
        question: "What does the Arabic word 'shukran - شكراً' mean?",
        answers: [
            { text: "Hello", correct: false},
            { text: "Thank you", correct: true},
            { text: "Sorry", correct: false},
        ]
    },
    {
        question: "Which letter of the Arabic alphabet is pronounced as a glottal stop?",
        answers: [
            { text: "Ha - ه", correct: false},
            { text: "Kaf - ك", correct: false},
            { text: "Hamza - ء", correct: true},
        ]
    },
    {
        question: "Which of the following is NOT a type of Arabic verb?",
        answers: [
            { text: "Past", correct: false},
            { text: "Present", correct: true},
            { text: "Future", correct: false},
        ]
    },
    {
        question: "What is the term for the Arabic grammatical construction that indicates the doer of an action?",
        answers: [
            { text: "Fa'il - فاعل", correct: true},
            { text: "Ism - إسم", correct: false},
            { text: "Fi'il - فعل", correct: false},
        ]
    },
    {
        question: "'Patience is the key to relief' is a popular Arabic saying. Which Arabic word is used for 'patience' in this saying?",
        answers: [
            { text: "Al Shukr - الشكر", correct: false},
            { text: "Al Sabr - الصبر", correct: true},
            { text: "Al Moftah - المفتاح", correct: false},
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

    // Pass the score and message to the server for Arabic language
    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'Arabic',
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