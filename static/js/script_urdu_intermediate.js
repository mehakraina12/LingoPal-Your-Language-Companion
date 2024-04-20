const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does 'آپ کیسے ہیں؟' mean in English?",
        answers: [
            { text: "How are you?", correct: true },
            { text: "Where are you?", correct: false },
            { text: "What are you doing?", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'I'm sorry' in Urdu?",
        answers: [
            { text: "میں معذرت خواہ ہوں (Mein mazrat khawah hoon)", correct: true },
            { text: "مجھے معاف کردیں (Mujhe maaf kardain)", correct: false },
            { text: "مجھے اردو نہیں آتی (Mujhe Urdu nahi aati)", correct: false }
        ]
    },
    {
        question: "What is the Urdu term for 'goodbye'?",
        answers: [
            { text: "خدا حافظ (Khuda Hafiz)", correct: true },
            { text: "ملتے ہیں (Milte hain)", correct: false },
            { text: "خوش آمدید (Khush Aamdeed)", correct: false }
        ]
    },
    {
        question: "How do you say 'I love you' in Urdu?",
        answers: [
            { text: "میں تم سے محبت کرتا ہوں (Mein tum se mohabbat karta hoon)", correct: true },
            { text: "میں تمہیں پسند کرتا ہوں (Mein tumhein pasand karta hoon)", correct: false },
            { text: "میں تم کو چاہتا ہوں (Mein tum ko chahta hoon)", correct: false }
        ]
    },
    {
        question: "What does 'آپ کہاں سے ہیں؟' mean in English?",
        answers: [
            { text: "Where did you come from?", correct: false },
            { text: "Where are you going?", correct: false },
            { text: "Where are you from?", correct: true }
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