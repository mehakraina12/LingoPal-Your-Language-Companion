const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Mandarin Chinese word for 'globalization'?",
        answers: [
            { text: "现代化 (xiàndàihuà)", correct: false},
            { text: "全球化 (quánqiúhuà)", correct: true},
            { text: "国际化 (guójìhuà)", correct: false},
        ]
    },
    {
        question: "Select the correct translation for 'to apologize' in Mandarin Chinese.",
        answers: [
            { text: "收到 (shōudào)", correct: false},
            { text: "感谢 (gǎnxiè)", correct: false},
            { text: "道歉 (dàoqiàn)", correct: true},
        ]
    },
    {
        question: "What does '太贵了' (tài guì le) mean in English?",
        answers: [
            { text: "It's too cheap.", correct: false},
            { text: "It's too late.", correct: false},
            { text: "It's too expensive.", correct: true},
        ]
    },
    {
        question: "Identify the correct translation for 'to donate' in Mandarin Chinese.",
        answers: [
            { text: "捐款 (juānkuǎn)", correct: false},
            { text: "捐献 (juānxiàn)", correct: false},
            { text: "捐赠 (juānzèng)", correct: true},
        ]
    },
    {
        question: "What is the Mandarin Chinese word for 'to encourage'?",
        answers: [
            { text: "激励 (jīlì)", correct: false},
            { text: "促进 (cùjìn)", correct: false},
            { text: "鼓励 (gǔlì)", correct: true},
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