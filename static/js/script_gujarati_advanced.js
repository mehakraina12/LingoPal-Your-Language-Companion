const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which word in Gujarati means 'water'?",
        answers: [
            { text: "પાણી", correct: true },
            { text: "રેલવે", correct: false },
            { text: "પ્રાણી", correct: false }
        ]
    },
    {
        question: "How do you say 'cat' in Gujarati?",
        answers: [
            { text: "કુતરો", correct: false },
            { text: "ગાય", correct: false },
            { text: "બિલાડી", correct: true }
        ]
    },
    {
        question: "What does 'વસ્તુ' mean in English?",
        answers: [
            { text: "Thing", correct: true },
            { text: "Place", correct: false },
            { text: "Person", correct: false }
        ]
    },
    {
        question: "Which Gujarati word means 'to speak'?",
        answers: [
            { text: "ગાય", correct: false },
            { text: "બોલવું", correct: true },
            { text: "સુંદર", correct: false }
        ]
    },
    {
        question: "What is the Gujarati word for 'pen'?",
        answers: [
            { text: "કાળા", correct: false },
            { text: "પેન્સિલ", correct: false },
            { text: "પેન", correct: true }
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