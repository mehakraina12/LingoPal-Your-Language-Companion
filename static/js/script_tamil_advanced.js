const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'Can you help me?' in Tamil?",
        answers: [
            { text: "உதவ முடியுமா? (Udhava mudiyuma?)", correct: true },
            { text: "உன்னுடைய பெயர் என்ன? (Unnudaiya peyar enna?)", correct: false },
            { text: "எனக்கு எதிர்காலம் கிடைக்கின்றது (Enakku edhirkalam kidayuthu)", correct: false }
        ]
    },
    {
        question: "What is the Tamil term for 'I don't understand'?",
        answers: [
            { text: "நான் புரியவில்லை (Naan puriyavillai)", correct: true },
            { text: "நான் விரைவில்லை (Naan virai villai)", correct: false },
            { text: "நான் செய்வேன் (Naan seiven)", correct: false }
        ]
    },
    {
        question: "How do you say 'I am hungry' in Tamil?",
        answers: [
            { text: "நான் பசியாகிறேன் (Naan pasiyagiren)", correct: true },
            { text: "நான் தனித்துவக்கிறேன் (Naan thanithuvagiren)", correct: false },
            { text: "நான் பழமொழியாகிறேன் (Naan pazhamozhiyagiren)", correct: false }
        ]
    },
    {
        question: "What does 'எங்கே போகிறீர்கள்?' mean in English?",
        answers: [
            { text: "Where are you going?", correct: true },
            { text: "Where do you live?", correct: false },
            { text: "What are you doing?", correct: false }
        ]
    },
    {
        question: "Which phrase translates to 'I'm tired' in Tamil?",
        answers: [
            { text: "நான் பழமொழியாகிறேன் (Naan pazhamozhiyagiren)", correct: false },
            { text: "நான் நீர் குடிக்கிறேன் (Naan neer kudikgiren)", correct: false },
            { text: "நான் சோதனை படுகிறேன் (Naan sothanaipadugiren)", correct: true }
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