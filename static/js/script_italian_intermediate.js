const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'Ciao' mean in English?",
        answers: [
            { text: "Goodbye", correct: false },
            { text: "Hello", correct: true },
            { text: "Thank you", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'Buongiorno, come stai?' in English?",
        answers: [
            { text: "Goodbye, how are you?", correct: false },
            { text: "Good morning, how are you?", correct: true },
            { text: "Good evening, how are you?", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'Grazie mille' in English?",
        answers: [
            { text: "Thank you very much", correct: true },
            { text: "You're welcome", correct: false },
            { text: "Excuse me", correct: false }
        ]
    },
    {
        question: "How do you say 'Mi chiamo Luca' in English?",
        answers: [
            { text: "My name is Luca", correct: true },
            { text: "I am Luca", correct: false },
            { text: "Your name is Luca", correct: false }
        ]
    },
    {
        question: "What does 'Come va?' mean in English?",
        answers: [
            { text: "What's your name?", correct: false },
            { text: "How are you?", correct: true },
            { text: "Where are you?", correct: false }
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