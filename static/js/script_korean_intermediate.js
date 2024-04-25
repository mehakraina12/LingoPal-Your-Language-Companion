const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase translates to '안녕하세요, 어떻게 지내세요?' in English?",
        answers: [
            { text: "Good morning, how are you?", correct: false },
            { text: "Hello, how are you?", correct: true },
            { text: "Good evening, how are you?", correct: false }
        ]
    },
    {
        question: "What is the meaning of '감사합니다' in English?",
        answers: [
            { text: "You're welcome", correct: false },
            { text: "Excuse me", correct: false },
            { text: "Thank you", correct: true }
        ]
    },
    {
        question: "How do you say '제 이름은 태희입니다' in English?",
        answers: [
            { text: "My name is Taehee", correct: true },
            { text: "I am Taehee", correct: false },
            { text: "Your name is Taehee", correct: false }
        ]
    },
    {
        question: "What does '안녕하세요, 어떻게 지내세요?' mean in English?",
        answers: [
            { text: "What's your name?", correct: false },
            { text: "How are you?", correct: true },
            { text: "Where are you?", correct: false }
        ]
    },
    {
        question: "Which sentence translates to '만나서 반가워요' in English?",
        answers: [
            { text: "I am happy to meet you", correct: true },
            { text: "I am sad to meet you", correct: false },
            { text: "I am angry to meet you", correct: false }
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