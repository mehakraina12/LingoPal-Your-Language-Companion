const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following sentences means 'I am tired' in Spanish?",
        answers: [
            { text: "Estoy feliz", correct: false},
            { text: "Estoy cansado", correct: true},
            { text: "Estoy hambriento", correct: false}
        ]
    },
    {
        question: "What does '¿Cómo te llamas?' mean in English?",
        answers: [
            { text: "What's your name?", correct: true},
            { text: "How are you?", correct: false},
            { text: "Where are you from?", correct: false},
        ]
    },
    {
        question: "What is the Spanish word for 'water'?",
        answers: [
            { text: "Leche", correct: false},
            { text: "Pan", correct: false},
            { text: "Agua", correct: true},
        ]
    },
    {
        question: "How do you say 'I don't understand' in Spanish?",
        answers: [
            { text: "No hablo español", correct: false},
            { text: "No entiendo", correct: true},
            { text: "Lo siento", correct: false},
        ]
    },
    {
        question: "What is the Spanish word for 'big'?",
        answers: [
            { text: "Pequeño", correct: false},
            { text: "Alto", correct: false},
            { text: "Grande", correct: true}
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