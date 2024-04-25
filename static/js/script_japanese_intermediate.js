const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'さようなら' mean in English?",
        answers: [
            { text: "Goodbye", correct: true },
            { text: "Hello", correct: false },
            { text: "Thank you", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'ごめんなさい' in English?",
        answers: [
            { text: "I'm sorry", correct: true },
            { text: "Excuse me", correct: false },
            { text: "Thank you", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'どうぞ' in English?",
        answers: [
            { text: "Please", correct: true },
            { text: "Thank you", correct: false },
            { text: "You're welcome", correct: false }
        ]
    },
    {
        question: "How do you say 'この町がとても気に入っています' in English?",
        answers: [
            { text: "I don't like this town", correct: false },
            { text: "I like this town", correct: true },
            { text: "I like that town", correct: false }
        ]
    },
    {
        question: "What does 'あなたはどこに住んでいますか' mean in English?",
        answers: [
            { text: "Where do you work?", correct: false },
            { text: "Where do you live?", correct: true },
            { text: "Where do you study?", correct: false }
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