const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following means 'Thank you' in Punjabi?",
        answers: [
            { text: "ਧੰਨਵਾਦ (Dhanavād)", correct: true },
            { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akaal)", correct: false },
            { text: "ਵਿਦਾਈ (Vidā'ī)", correct: false }
        ]
    },
    {
        question: "How do you say 'Goodbye' in Punjabi?",
        answers: [
            { text: "ਧੰਨਵਾਦ (Dhanavād)", correct: false },
            { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akaal)", correct: false },
            { text: "ਵਿਦਾਈ (Vidā'ī)", correct: true }
        ]
    },
    {
        question: "What is the Punjabi word for 'Yes'?",
        answers: [
            { text: "ਹਾਂ (Hāṃ)", correct: true },
            { text: "ਨਹੀਂ (Nahīṃ)", correct: false },
            { text: "ਸਵਾਗਤ (Swāgat)", correct: false }
        ]
    },
    {
        question: "Which phrase means 'My name is' in Punjabi?",
        answers: [
            { text: "ਮੇਰਾ ਨਾਮ (Mērā nāma)", correct: false },
            { text: "ਮੇਰੀ ਨਾਮ (Merī nāma)", correct: false },
            { text: "ਮੇਰਾ ਨਾਮ ਹੈ (Mērā nāma hai)", correct: true }
        ]
    },
    {
        question: "What does 'ਧੰਨਵਾਦ' (Dhanavād) mean in English?",
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