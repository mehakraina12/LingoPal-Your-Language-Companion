const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'hacer' mean in English?",
        answers: [
            { text: "To have", correct: false },
            { text: "To make/do", correct: true },
            { text: "To be", correct: false }
        ]
    },
    {
        question: "How do you say 'friend' in Spanish?",
        answers: [
            { text: "Amigo", correct: true },
            { text: "Amor", correct: false },
            { text: "Familia", correct: false }
        ]
    },
    {
        question: "What is the Spanish word for 'house'?",
        answers: [
            { text: "Casa", correct: true },
            { text: "Hogar", correct: false },
            { text: "Edificio", correct: false }
        ]
    },
    {
        question: "Which phrase means 'to go shopping' in Spanish?",
        answers: [
            { text: "Ir de vacaciones", correct: false },
            { text: "Ir de compras", correct: true },
            { text: "Ir al cine", correct: false }
        ]
    },
    {
        question: "What does 'perro' mean in English?",
        answers: [
            { text: "Cat", correct: false },
            { text: "Dog", correct: true },
            { text: "Bird", correct: false }
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