const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Punjabi term for 'ਖਾਣ ਦਾ ਆਰਂਭ ਕਰੋ'?",
        answers: [
            { text: "Good morning", correct: false },
            { text: "Let's eat", correct: true },
            { text: "Good evening", correct: false }
        ]
    },
    {
        question: "How do you say 'ਮੁਆਫ ਕਰੋ, ਬਾਥਰੂਮ ਕਿੱਥੇ ਹੈ?' in English?",
        answers: [
            { text: "Excuse me, where is the bathroom?", correct: true },
            { text: "Excuse me, where is the kitchen?", correct: false },
            { text: "Excuse me, where is the bedroom?", correct: false }
        ]
    },
    {
        question: "What does 'ਖੁਸ਼ੀ ਮਿਲਣ ਨੂੰ ਬਾਅਦ' mean in English?",
        answers: [
            { text: "Goodbye", correct: true },
            { text: "Hello", correct: false },
            { text: "Thank you", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'ਮੁਆਫ ਕਰੋ' in English?",
        answers: [
            { text: "I'm sorry", correct: false },
            { text: "Excuse me", correct: false },
            { text: "Thank you", correct: true }
        ]
    },
    {
        question: "What is the meaning of 'ਕਿਰਪਾ ਕਰੋ' in English?",
        answers: [
            { text: "Please", correct: true },
            { text: "Thank you", correct: false },
            { text: "You're welcome", correct: false }
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