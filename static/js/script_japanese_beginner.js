const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'こんにちは' (Konnichiwa) mean in English?",
        answers: [
            { text: "Good morning", correct: false },
            { text: "Good afternoon", correct: true },
            { text: "Good evening", correct: false }
        ]
    },
    {
        question: "Which of the following means 'Thank you' in Japanese?",
        answers: [
            { text: "ありがとう (Arigatou)", correct: true },
            { text: "こんにちは (Konnichiwa)", correct: false },
            { text: "さようなら (Sayonara)", correct: false }
        ]
    },
    {
        question: "How do you say 'Goodbye' in Japanese?",
        answers: [
            { text: "ありがとう (Arigatou)", correct: false },
            { text: "こんにちは (Konnichiwa)", correct: false },
            { text: "さようなら (Sayonara)", correct: true }
        ]
    },
    {
        question: "What is the Japanese word for 'Yes'?",
        answers: [
            { text: "はい (Hai)", correct: true },
            { text: "いいえ (Iie)", correct: false },
            { text: "おはようございます (Ohayou gozaimasu)", correct: false }
        ]
    },
    {
        question: "Which phrase means 'My name is' in Japanese?",
        answers: [
            { text: "わたしのなまえは (Watashi no namae wa)", correct: false },
            { text: "とてもうれしいです (Totemo ureshii desu)", correct: false },
            { text: "わたしは (Watashi wa)", correct: true }
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