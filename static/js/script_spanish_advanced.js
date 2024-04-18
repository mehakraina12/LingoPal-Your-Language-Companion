const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'to take a shower'?",
        answers: [
            { text: "Tomar una siesta", correct: false },
            { text: "Tomar una ducha", correct: true },
            { text: "Tomar un baño", correct: false }
        ]
    },
    {
        question: "What does 'trabajar' mean in English?",
        answers: [
            { text: "To work", correct: true },
            { text: "To rest", correct: false },
            { text: "To play", correct: false }
        ]
    },
    {
        question: "How do you say 'to dance' in Spanish?",
        answers: [
            { text: "Cantar", correct: false },
            { text: "Bailar", correct: true },
            { text: "Correr", correct: false }
        ]
    },
    {
        question: "What is the Spanish word for 'family'?",
        answers: [
            { text: "Familia", correct: true },
            { text: "Amigos", correct: false },
            { text: "Parientes", correct: false }
        ]
    },
    {
        question: "Which phrase means 'to watch television'?",
        answers: [
            { text: "Escuchar música", correct: false },
            { text: "Leer un libro", correct: false },
            { text: "Ver la televisión", correct: true }
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