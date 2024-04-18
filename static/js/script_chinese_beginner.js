const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the correct translation of 'computer' in Mandarin Chinese?",
        answers: [
            { text: "电话 (diànhuà)", correct: false},
            { text: "电脑 (diànnǎo)", correct: true},
            { text: "冰箱 (bīngxiāng)", correct: false},
        ]
    },
    {
        question: "Which of the following characters means 'to study' in Mandarin Chinese?",
        answers: [
            { text: "学 (xué)", correct: true},
            { text: "吃 (chī)", correct: false},
            { text: "睡 (shuì)", correct: false},
        ]
    },
    {
        question: "Identify the correct translation for 'Congratulations!' in Mandarin Chinese.",
        answers: [
            { text: "加油！(jiāyóu)", correct: false},
            { text: "对不起！(duìbùqǐ)", correct: false},
            { text: "恭喜你！(gōngxǐ nǐ)", correct: true},
        ]
    },
    {
        question: "What is the Mandarin Chinese word for 'umbrella'?",
        answers: [
            { text: "椅子 (yǐzi)", correct: false},
            { text: "手表 (shǒubiǎo)", correct: false},
            { text: "雨伞 (yǔsǎn)", correct: true},
        ]
    },
    {
        question: "Select the correct translation for 'to travel' in Mandarin Chinese.",
        answers: [
            { text: "听音乐 (tīng yīnyuè)", correct: false},
            { text: "看电影 (kàn diànyǐng)", correct: false},
            { text: "旅行 (lǚxíng)", correct: true},
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