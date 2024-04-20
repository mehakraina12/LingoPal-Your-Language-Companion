const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Arabic alphabet has...",
        answers: [
            { text: "26 letters", correct: false},
            { text: "27 letters", correct: false},
            { text: "28 letters", correct: true},
        ]
    },
    {
        question: "How many vowel phonemes are there in Arabic?",
        answers: [
            { text: "3", correct: false},
            { text: "6", correct: true},
            { text: "4", correct: false},
        ]
    },
    {
        question: "عمتها means:",
        answers: [
            { text: "Her cousin", correct: false},
            { text: "Her aunt", correct: true},
            { text: "Our uncle", correct: false},
        ]
    },
    {
        question: "هناك سيارة خضراء means:",
        answers: [
            { text: "That is a small car", correct: false},
            { text: "That is a blue car", correct: false},
            { text: "There is a green car", correct: true},
        ]
    },
    {
        question: "لن اذهب معه means:",
        answers: [
            { text: "I don't go with you", correct: false},
            { text: "I will not go with him", correct: true},
            { text: "I will not go with her", correct: false},
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