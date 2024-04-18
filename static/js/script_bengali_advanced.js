const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Select the synonym for 'উদাহরণ' (udahoron) in Bengali.",
        answers: [
            { text: "প্রতিমন্ত্রী (protimontro)", correct: false},
            { text: "নিয়ম (niyom)", correct: false},
            { text: "উদাহরণ (udahoron)", correct: true},
        ]
    },
    {
        question: "What is the correct translation of 'approximately' in Bengali?",
        answers: [
            { text: "আদম্য (adomyo)", correct: false},
            { text: "প্রায় (pray)", correct: true},
            { text: "দুর্বল (durbol)", correct: false},
        ]
    },
    {
        question: "Identify the Bengali word for 'community'.",
        answers: [
            { text: "দেশ (desh)", correct: false},
            { text: "সমাজ (shomaj)", correct: true},
            { text: "দোকান (dokan)", correct: false},
        ]
    },
    {
        question: "What does 'সত্য' (sotto) mean in English?",
        answers: [
            { text: "Hoped", correct: false},
            { text: "Lie", correct: false},
            { text: "Truth", correct: true},
        ]
    },
    {
        question: "Which of the following is a correct translation for 'government' in Bengali?",
        answers: [
            { text: "বিচারক (bicharok)", correct: false},
            { text: "নির্বাচন (nirbachon)", correct: false},
            { text: "সরকার (shorokar)", correct: true},
        ]
    },

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