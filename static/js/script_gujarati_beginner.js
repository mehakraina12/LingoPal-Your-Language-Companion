const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following sentences means 'I am hungry' in Gujarati?",
        answers: [
            { text: "મારું નામ જોયાં છે.", correct: false},
            { text: "હું ભૂખો છું.", correct: true},
            { text: "મારું ઘર ક્યાં છે?", correct: false}
        ]
    },
    {
        question: "What does 'મારું નામ રાજેશ છે' mean in English?",
        answers: [
            { text: "My name is Rajesh.", correct: true},
            { text: "I am tired.", correct: false},
            { text: "I am happy.", correct: false},
        ]
    },
    {
        question: "What is the Gujarati word for 'goodbye'?",
        answers: [
            { text: "ચાલો", correct: false},
            { text: "અલવિદા", correct: true},
            { text: "હેલો", correct: false},
        ]
    },
    {
        question: "How do you say 'please' in Gujarati?",
        answers: [
            { text: "કૃપા કરીને", correct: false},
            { text: "આવજો", correct: false},
            { text: "કૃપા કરીને", correct: true},
        ]
    },
    {
        question: "What is the Gujarati word for 'how are you'?",
        answers: [
            { text: "તમે કેમ છો?", correct: true},
            { text: "સુખદ રહો", correct: false},
            { text: "તમે કઈ છો?", correct: false}
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