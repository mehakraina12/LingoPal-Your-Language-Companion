const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following means 'Thank you' in Italian?",
        answers: [
            { text: "Grazie", correct: true },
            { text: "Ciao", correct: false },
            { text: "Arrivederci", correct: false }
        ]
    },
    {
        question: "How do you say 'Good morning' in Italian?",
        answers: [
            { text: "Buonasera", correct: false },
            { text: "Buongiorno", correct: true },
            { text: "Buonanotte", correct: false }
        ]
    },
    {
        question: "What is the Italian word for 'Yes'?",
        answers: [
            { text: "No", correct: false },
            { text: "Sì", correct: true },
            { text: "Grazie", correct: false }
        ]
    },
    {
        question: "Which phrase means 'My name is' in Italian?",
        answers: [
            { text: "Mi chiamo", correct: true },
            { text: "Mi dispiace", correct: false },
            { text: "Come stai", correct: false }
        ]
    },
    {
        question: "What does 'Buonasera' mean in English?",
        answers: [
            { text: "Good morning", correct: false },
            { text: "Good afternoon", correct: true },
            { text: "Good evening", correct: false }
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