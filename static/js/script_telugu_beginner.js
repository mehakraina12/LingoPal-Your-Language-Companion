const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following means 'Thank you' in Telugu?",
        answers: [
            { text: "ధన్యవాదము (Dhanyavādamu)", correct: true },
            { text: "నమస్తే (Namastē)", correct: false },
            { text: "విదాయం (Vidāyaṁ)", correct: false }
        ]
    },
    {
        question: "How do you say 'Goodbye' in Telugu?",
        answers: [
            { text: "ధన్యవాదము (Dhanyavādamu)", correct: false },
            { text: "నమస్తే (Namastē)", correct: false },
            { text: "విదాయం (Vidāyaṁ)", correct: true }
        ]
    },
    {
        question: "What is the Telugu word for 'Yes'?",
        answers: [
            { text: "అవును (Avunu)", correct: true },
            { text: "కాదు (Kādu)", correct: false },
            { text: "అర్ధం (Ardhaṁ)", correct: false }
        ]
    },
    {
        question: "Which phrase means 'My name is' in Telugu?",
        answers: [
            { text: "నా పేరు (Nā pēru)", correct: true },
            { text: "నా ఇటువంటి (Nā iṭuvanṭi)", correct: false },
            { text: "నా గృహం (Nā gṛhaṁ)", correct: false }
        ]
    },
    {
        question: "What does 'ధన్యవాదము' (Dhanyavādamu) mean in English?",
        answers: [
            { text: "Thank you", correct: true },
            { text: "Hello", correct: false },
            { text: "Goodbye", correct: false }
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