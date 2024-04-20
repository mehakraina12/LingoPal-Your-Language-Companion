const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "How do you say '私の名前は太郎です' in English?",
        answers: [
            { text: "My name is Taro", correct: true },
            { text: "I am Taro", correct: false },
            { text: "Your name is Taro", correct: false }
        ]
    },
    {
        question: "What does '元気ですか' mean in English?",
        answers: [
            { text: "What's your name?", correct: false },
            { text: "How are you?", correct: true },
            { text: "Where are you?", correct: false }
        ]
    },
    {
        question: "Which sentence translates to 'あなたに会えて嬉しい' in English?",
        answers: [
            { text: "I am happy to meet you", correct: true },
            { text: "I am sad to meet you", correct: false },
            { text: "I am angry to meet you", correct: false }
        ]
    },
    {
        question: "What is the Japanese term for 'いただきます'?",
        answers: [
            { text: "Good morning", correct: false },
            { text: "Let's eat", correct: true },
            { text: "Good evening", correct: false }
        ]
    },
    {
        question: "How do you say 'すみません、トイレはどこですか' in English?",
        answers: [
            { text: "Excuse me, where is the bathroom?", correct: true },
            { text: "Excuse me, where is the kitchen?", correct: false },
            { text: "Excuse me, where is the bedroom?", correct: false }
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