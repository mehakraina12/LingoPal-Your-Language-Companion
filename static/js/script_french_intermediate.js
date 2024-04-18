const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'Je ne sais quoi' mean in English?",
        answers: [
            { text: "I don't know what", correct: false },
            { text: "Something special", correct: true },
            { text: "I know something", correct: false }
        ]
    },
    {
        question: "How do you say 'to take a nap' in French?",
        answers: [
            { text: "Prendre un repas", correct: false },
            { text: "Faire une sieste", correct: true },
            { text: "Prendre un bain", correct: false }
        ]
    },
    {
        question: "Which French phrase means 'to hit the nail on the head'?",
        answers: [
            { text: "Mettre de l'eau dans son vin", correct: false },
            { text: "Casser les pieds", correct: false },
            { text: "Mettre le doigt sur quelque chose", correct: true }
        ]
    },
    {
        question: "What is the French word for 'awkward'?",
        answers: [
            { text: "Maladroit", correct: true },
            { text: "Étrange", correct: false },
            { text: "Gênant", correct: false }
        ]
    },
    {
        question: "How would you say 'to crack a joke' in French?",
        answers: [
            { text: "Faire un blague", correct: false },
            { text: "Casser une blague", correct: true },
            { text: "Rire d'une blague", correct: false }
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