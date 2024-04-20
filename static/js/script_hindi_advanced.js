const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'मुझे भूख लगी है' mean in English?",
        answers: [
            { text: "I am thirsty", correct: false },
            { text: "I am full", correct: false },
            { text: "I am hungry", correct: true }
        ]
    },
    {
        question: "How do you say 'क्या आप अंग्रेज़ी बोलते हैं?' in English?",
        answers: [
            { text: "Do you speak Hindi?", correct: false },
            { text: "Can you speak English?", correct: true },
            { text: "Are you from England?", correct: false }
        ]
    },
    {
        question: "What is the Hindi term for 'धीरे-धीरे'?",
        answers: [
            { text: "Slowly", correct: true },
            { text: "Quickly", correct: false },
            { text: "Suddenly", correct: false }
        ]
    },
    {
        question: "Which phrase means 'आपका स्वागत है' in English?",
        answers: [
            { text: "Welcome to you", correct: false },
            { text: "You're welcome", correct: false },
            { text: "Welcome", correct: true }
        ]
    },
    {
        question: "What does 'मैं थक गया हूँ' mean in English?",
        answers: [
            { text: "I am tired", correct: true },
            { text: "I am hungry", correct: false },
            { text: "I am sleepy", correct: false }
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