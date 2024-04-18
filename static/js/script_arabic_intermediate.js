const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following verbs is the correct form of 'to write' in the past tense?",
        answers: [
            { text: "كتابة (kitābah)", correct: false},
            { text: "يكتب (yaktub)", correct: false},
            { text: "كتبت (katabtu)", correct: true},
        ]
    },
    {
        question: "What is the correct order of the Arabic alphabet?",
        answers: [
            { text: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي", correct: false},
            { text: "أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي", correct: true},
            { text: "ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي أ", correct: false},
        ]
    },
    {
        question: "In the phrase 'الكتاب الأحمر' (al-kitāb al-aḥmar), what does 'الأحمر' (al-aḥmar) mean?",
        answers: [
            { text: "The paper", correct: false},
            { text: "The red", correct: true},
            { text: "The bookshelf", correct: false},
        ]
    },
    {
        question: "Which of the following pronouns means 'you' in Arabic when addressing a female?",
        answers: [
            { text: "أنتِ (anti)", correct: true},
            { text: "هو (huwa)", correct: false},
            { text: "أنا (anā)", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct possessive pronoun in Arabic?",
        answers: [
            { text: " سأكتب (sa'aktub)", correct: false},
            { text: "كتابتها (kitābatuhā)", correct: false},
            { text: "كتابه (kitābuhu)", correct: true},
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