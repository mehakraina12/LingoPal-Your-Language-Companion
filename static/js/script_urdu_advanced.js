const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase translates to 'What's your name?' in Urdu?",
        answers: [
            { text: "آپ کا نام کیا ہے؟ (Aap ka naam kya hai?)", correct: true },
            { text: "آپ کا پتہ کیا ہے؟ (Aap ka pata kya hai?)", correct: false },
            { text: "آپ کا دوست کون ہے؟ (Aap ka dost kaun hai?)", correct: false }
        ]
    },
    {
        question: "What is the meaning of 'آپ کیسی محسوس کر رہے ہیں؟' in English?",
        answers: [
            { text: "How are you feeling?", correct: true },
            { text: "What are you doing?", correct: false },
            { text: "How are you?", correct: false }
        ]
    },
    {
        question: "How do you say 'Excuse me' in Urdu?",
        answers: [
            { text: "معاف کریں (Maaf karein)", correct: true },
            { text: "مجھے معذرت چاہیے (Mujhe mazrat chahiye)", correct: false },
            { text: "مجھے معافی چاہیے (Mujhe maafi chahiye)", correct: false }
        ]
    },
    {
        question: "What does 'میں گھر جا رہا ہوں' mean in English?",
        answers: [
            { text: "I am going to work", correct: false },
            { text: "I am coming home", correct: true },
            { text: "I am going to the market", correct: false }
        ]
    },
    {
        question: "Which phrase means 'Can you help me?' in Urdu?",
        answers: [
            { text: "کیا آپ میری مدد کر سکتے ہیں؟ (Kya aap meri madad kar sakte hain?)", correct: true },
            { text: "مجھے مدد چاہیے (Mujhe madad chahiye)", correct: false },
            { text: "مجھے سمجھ نہیں آرہا (Mujhe samajh nahi araha)", correct: false }
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