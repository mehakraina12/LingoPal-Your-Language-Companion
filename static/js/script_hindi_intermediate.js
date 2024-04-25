const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase translates to 'कृपया ध्यान दें' in English?",
        answers: [
            { text: "Please pay attention", correct: true },
            { text: "Please be quiet", correct: false },
            { text: "Please hurry up", correct: false }
        ]
    },
    {
        question: "What does 'मैं अभी आया हूँ' mean in English?",
        answers: [
            { text: "I am leaving now", correct: false },
            { text: "I am coming right now", correct: true },
            { text: "I will come later", correct: false }
        ]
    },
    {
        question: "How do you say 'धन्यवाद आपका स्वागत है' in English?",
        answers: [
            { text: "Thank you, you're welcome", correct: false },
            { text: "Thank you, you're welcome here", correct: true },
            { text: "Thank you, welcome back", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'क्या हाल है?' in English?",
        answers: [
            { text: "What's the problem?", correct: false },
            { text: "How are you?", correct: true },
            { text: "What's happening?", correct: false }
        ]
    },
    {
        question: "Which sentence translates to 'मैंने उसे एक पत्र लिखा' in English?",
        answers: [
            { text: "I received a letter from him", correct: false },
            { text: "I wrote him a letter", correct: true },
            { text: "I read a letter to him", correct: false }
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