const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'Schadenfreude' mean in English?",
        answers: [
            { text: "Guilt", correct: false },
            { text: "Happiness", correct: false },
            { text: "Taking pleasure in someone else's misfortune", correct: true }
        ]
    },
    {
        question: "How do you say 'to hit the ground running' in German?",
        answers: [
            { text: "Sofort starten", correct: false },
            { text: "Den Boden schlagen", correct: false },
            { text: "Direkt loslegen", correct: true }
        ]
    },
    {
        question: "Which German phrase means 'to jump out of one's skin'?",
        answers: [
            { text: "Aus der Haut fahren", correct: false },
            { text: "Aus der Haut springen", correct: false },
            { text: "Aus der Haut fahren vor Schreck", correct: true }
        ]
    },
    {
        question: "What is the German word for 'punctual'?",
        answers: [
            { text: "Pünktlich", correct: true },
            { text: "Früh", correct: false },
            { text: "Genau", correct: false }
        ]
    },
    {
        question: "How would you say 'to beat around the bush' in German?",
        answers: [
            { text: "Um den Busch schlagen", correct: false },
            { text: "Den Busch schlagen", correct: false },
            { text: "Um den heißen Brei herumreden", correct: true }
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