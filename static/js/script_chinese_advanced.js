const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Identify the correct translation for 'hospital' in Mandarin Chinese.",
        answers: [
            { text: "商店 (shāngdiàn)", correct: false},
            { text: "银行 (yínháng)", correct: false},
            { text: "医院 (yīyuàn)", correct: true},
        ]
    },
    {
        question: "What is the Mandarin Chinese word for 'passport'?",
        answers: [
            { text: "身份证 (shēnfènzhèng)", correct: false},
            { text: "钥匙 (yàoshi)", correct: false},
            { text: "护照 (hùzhào)", correct: true},
        ]
    },
    {
        question: "Select the correct translation for 'to celebrate' in Mandarin Chinese.",
        answers: [
            { text: "唱歌 (chànggē)", correct: false},
            { text: "聚会 (jùhuì)", correct: false},
            { text: "庆祝 (qìngzhù)", correct: true},
        ]
    },
    {
        question: "What does '现在几点了？' (xiànzài jǐ diǎn le?) mean in English?",
        answers: [
            { text: "What time is it now?", correct: true},
            { text: "How old are you?", correct: false},
            { text: "Where are you?", correct: false},
        ]
    },
    {
        question: "Identify the correct translation for 'to arrive late' in Mandarin Chinese.",
        answers: [
            { text: "迟到 (chídào)", correct: true},
            { text: "早到 (zǎodào)", correct: false},
            { text: "准时到达 (zhǔnshí dàodá)", correct: false},
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