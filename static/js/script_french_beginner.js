const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the French word for 'hello'?",
        answers: [
            { text: "Bonjour", correct: true},
            { text: "Merci", correct: false},
            { text: "Au revoir", correct: false},
        ]
    },
    {
        question: "How do you say 'thank you' in French?",
        answers: [
            { text: "Bonjour", correct: false},
            { text: "Merci", correct: true},
            { text: "Au revoir", correct: false},
        ]
    },
    {
        question: "What is the French word for 'yes'?",
        answers: [
            { text: "Bonjour", correct: false},
            { text: "Merci", correct: false},
            { text: "Oui", correct: true}
        ]
    },
    {
        question: "Which of the following sentences means 'I am hungry' in French?",
        answers: [
            { text: "Je suis fatigué.", correct: false},
            { text: "Je suis affamé.", correct: true},
            { text: "Je suis content.", correct: false}
        ]
    },
    {
        question: "What does 'Je m'appelle Marie' mean in English?",
        answers: [
            { text: "I am hungry.", correct: false},
            { text: "My name is Marie.", correct: true},
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