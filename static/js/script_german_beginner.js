const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the German word for 'hello'?",
        answers: [
            { text: "Hallo", correct: true},
            { text: "Guten Tag", correct: false},
            { text: "Auf Wiedersehen", correct: false},
        ]
    },
    {
        question: "How do you say 'thank you' in German?",
        answers: [
            { text: "Danke", correct: true},
            { text: "Bitte", correct: false},
            { text: "Entschuldigung", correct: false},
        ]
    },
    {
        question: "What is the German word for 'yes'?",
        answers: [
            { text: "Ja", correct: true},
            { text: "Nein", correct: false},
            { text: "Vielleicht", correct: false}
        ]
    },
    {
        question: "Which of the following sentences means 'I am hungry' in German?",
        answers: [
            { text: "Ich bin müde.", correct: false},
            { text: "Ich habe Hunger.", correct: true},
            { text: "Ich bin glücklich.", correct: false}
        ]
    },
    {
        question: "What does 'Ich heiße Peter' mean in English?",
        answers: [
            { text: "My name is Peter.", correct: true},
            { text: "I am tired.", correct: false},
            { text: "I am happy.", correct: false},
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