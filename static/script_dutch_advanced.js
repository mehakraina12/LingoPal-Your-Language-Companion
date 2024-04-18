const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "How do you say 'I love you' in Dutch?",
        answers: [
            { text: "Ik hou van jou", correct: true},
            { text: "Ik hou van je", correct: false},
            { text: "Ik houd van jou", correct: false}
        ]
    },
    {
        question: "What is the Dutch word for 'cloud'?",
        answers: [
            { text: "Zon", correct: false},
            { text: "Regen", correct: false},
            { text: "Wolk", correct: true}
        ]
    },
    {
        question: "What is the Dutch word for 'river'?",
        answers: [
            { text: "Zee", correct: false},
            { text: "Rivier", correct: true},
            { text: "Meer", correct: false}
        ]
    },
    {
        question: "What is the Dutch equivalent of 'Goodbye'?",
        answers: [
            { text: "Hallo", correct: false},
            { text: "Goedemorgen", correct: false},
            { text: "Tot ziens", correct: true}
        ]
    },
    {
        question: "Which Dutch word means 'bicycle'?",
        answers: [
            { text: "Auto", correct: false},
            { text: "Trein", correct: false},
            { text: "Fiets", correct: true}
        ]
    },
    {
        question: "How do you say 'Thank you very much' in Dutch?",
        answers: [
            { text: "Dank je wel", correct: false},
            { text: "Dank u wel", correct: false},
            { text: "Heel erg bedankt", correct: true}
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