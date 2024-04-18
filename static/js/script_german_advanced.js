const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'to throw in the towel' in German?",
        answers: [
            { text: "Das Handtuch werfen", correct: true },
            { text: "Die Decke werfen", correct: false },
            { text: "Das Handtuch schmeißen", correct: false }
        ]
    },
    {
        question: "What does 'Fernweh' mean in English?",
        answers: [
            { text: "Homesickness", correct: false },
            { text: "Wanderlust", correct: true },
            { text: "Nostalgia", correct: false }
        ]
    },
    {
        question: "How do you say 'to have a green thumb' in German?",
        answers: [
            { text: "Einen grünen Daumen haben", correct: true },
            { text: "Einen grünen Arm haben", correct: false },
            { text: "Einen grünen Finger haben", correct: false }
        ]
    },
    {
        question: "Which German phrase means 'to have a frog in one's throat'?",
        answers: [
            { text: "Einen Frosch im Hals haben", correct: true },
            { text: "Einen Frosch im Magen haben", correct: false },
            { text: "Einen Frosch im Kopf haben", correct: false }
        ]
    },
    {
        question: "What is the German term for 'to spill the beans'?",
        answers: [
            { text: "Die Bohnen verschütten", correct: false },
            { text: "Die Geheimnisse enthüllen", correct: false },
            { text: "Die Katze aus dem Sack lassen", correct: true }
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