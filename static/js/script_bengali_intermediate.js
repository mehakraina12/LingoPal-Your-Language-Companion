const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Identify the correct translation for 'What is your profession?' in Bengali.",
        answers: [
            { text: "তোমার কী কাজ?", correct: false},
            { text: "তোমার কী অধিভাষা?", correct: false},
            { text: "আপনার পেশা কী?", correct: true},
        ]
    },
    {
        question: "Select the correct word for 'globalization' in Bengali.",
        answers: [
            { text: "জাতিসংঘ (jatisongho)", correct: false},
            { text: "বিশ্বীকরণ (bishwikoron)", correct: true},
            { text: "অবস্থান (obosthan)", correct: false},
        ]
    },
    {
        question: "What does the Bengali phrase 'তার বাসা যেখানে' (tar basha jekhane) mean in English?",
        answers: [
            { text: "When will he come?", correct: false},
            { text: "Where is his house?", correct: true},
            { text: "Whose book is this?", correct: false},
        ]
    },
    {
        question: "Which of the following sentences is grammatically correct in Bengali?",
        answers: [
            { text: "তুমি কোথায় যাও?", correct: false},
            { text: "তোমার ছাত্র কোথায়?", correct: false},
            { text: "আমি আগামী বছর বিদ্যালয়ে যাব।", correct: true},
        ]
    },
    {
        question: "Which of the following represents the correct spelling for 'technology' in Bengali?",
        answers: [
            { text: "কাজ (kaj)", correct: false},
            { text: "কল্পনা (kolpona)", correct: false},
            { text: "প্রযুক্তি (proyukti)", correct: true},
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