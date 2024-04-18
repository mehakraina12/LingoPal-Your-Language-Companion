const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the correct plural form of 'book'?",
        answers: [
            { text: "Books", correct: true},
            { text: "Bookes", correct: false},
            { text: "Book", correct: false},
        ]
    },
    {
        question: "What is the opposite of 'hot'?",
        answers: [
            { text: "Cold", correct: true},
            { text: "Warm", correct: false},
            { text: "Cool", correct: false},
        ]
    },
    {
        question: "What is the opposite of 'big'?",
        answers: [
            { text: "Large", correct: false},
            { text: "Small", correct: true},
            { text: "Giant", correct: false},
        ]
    },
    {
        question: "Which sentence is correct?",
        answers: [
            { text: "She is goes to school.", correct: false},
            { text: "She go to school.", correct: false},
            { text: "She goes to school.", correct: true},
        ]
    },
    {
        question: "What is the past tense of 'eat'?",
        answers: [
            { text: "Eating", correct: false},
            { text: "Ate", correct: true},
            { text: "Eaten", correct: false},
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