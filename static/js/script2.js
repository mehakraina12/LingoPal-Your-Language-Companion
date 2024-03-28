const questions = [
    {
        question: "Which are the 5 vowels in English alphabet?",
        answers: [
            { text: "a,t,u,p,e", correct: false},
            { text: "a,e,i,o,u", correct: true},
            { text: "k,i,a,o,u", correct: false},
            { text: "j,e,l,u,m", correct: false},
        ]
    },
    {
        question: "_________do you live?",
        answers: [
            { text: "Where", correct: true},
            { text: "Will", correct: false},
            { text: "Hence", correct: false},
            { text: "However", correct: false},
        ]
    },
    {
        question: "My hobby _________ to play bandminton?",
        answers: [
            { text: "are", correct: false},
            { text: "were", correct: false},
            { text: "am", correct: false},
            { text: "is", correct: true},
        ]
    },
    {
        question: "I _________ the Taj Mahal last month?",
        answers: [
            { text: "visit", correct: false},
            { text: "visited", correct: true},
            { text: "visits", correct: false},
            { text: "visiting", correct: false},
        ]
    }
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