const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Bengali word for 'book'?",
        answers: [
            { text: "খাবার (khabar)", correct: false},
            { text: "পাতা (pata)", correct: false},
            { text: "বই (boi)", correct: true},
        ]
    },
    {
        question: "Which of the following is the correct translation for 'hello' in Bengali?",
        answers: [
            { text: "হায় (Hay)", correct: false},
            { text: "নমস্কার (Nomoskar)", correct: true},
            { text: "আপনি কেমন আছেন? (Apani kemon achhen?)", correct: false},
        ]
    },
    {
        question: "What is the plural form of 'ছেলে' (chhele), meaning 'boy' in Bengali?",
        answers: [
            { text: "বাচ্চা (bachcha)", correct: false},
            { text: "ছেলেরা (chhelerā)", correct: true},
            { text: "ছেলে (chhele)", correct: false},
        ]
    },
    {
        question: "What is the Bengali word for 'water'?",
        answers: [
            { text: "আম", correct: false},
            { text: "মাছ", correct: false},
            { text: "পানি", correct: true},
        ]
    },
    {
        question: "Which of the following is the correct translation for 'hello' in Bengali?",
        answers: [
            { text: "কেমন আছো? (kemon achho?)", correct: false},
            { text: "আপনি কেমন আছেন? (apni kemon achen?)", correct: false},
            { text: "নমস্কার (nomoskar)", correct: true},
        ]
    },

];

const questionElement=document.getElementById("question");
const answerButtons=document.getElementById("answer-buttons");
const nextButton=document.getElementById("next-btn");

let currentquestionindex=0;
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

function showScore(){
    resetState();
    questionElement.innerHTML=`You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML="Play Again";
    nextButton.style.display="block";
}

function handleNextButton(){
    currentquestionindex++;
    if(currentquestionindex<questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentquestionindex<questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})

startQuiz();