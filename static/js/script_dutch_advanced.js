const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which of the following sentences correctly uses the Dutch verb 'zullen' (to shall/will) in the future tense?",
        answers: [
            { text: "Ik ben morgen naar de bioscoop.", correct: false},
            { text: "Zij eet altijd gezond.", correct: false},
            { text: "We zullen volgende week naar Parijs gaan.", correct: true},
            { text: "Jij hebt gisteren de brief geschreven.", correct: false}
        ]
    },
    {
        question: "What is the correct translation of the Dutch phrase 'Ik kan het niet uitstaan' into English?",
        answers: [
            { text: "I can't stand it.", correct: true},
            { text: "I can't wait.", correct: false},
            { text: "I can't understand.", correct: false},
            { text: "I can't believe it.", correct: false}
        ]
    },
    {
        question: "Choose the sentence with the correct word order:",
        answers: [
            { text: "Hij is altijd goed in wiskunde geweest.", correct: true},
            { text: "Altijd hij goed is in wiskunde geweest.", correct: false},
            { text: "In wiskunde altijd is hij goed geweest.", correct: false},
            { text: "Goed hij is altijd in wiskunde geweest.", correct: false}
        ]
    },
    {
        question: "Which phrase means 'I have been studying Dutch for two years' in Dutch?",
        answers: [
            { text: "Ik heb Nederlands twee jaar studeer.", correct: false},
            { text: "Ik heb twee jaar Nederlands gestudeerd.", correct: true},
            { text: "Ik twee jaar Nederlands heb gestudeerd.", correct: false},
            { text: "Twee jaar Nederlands ik heb gestudeerd.", correct: false}
        ]
    },
    {
        question: "Select the correct translation for the Dutch phrase 'De maan schijnt helder' into English:",
        answers: [
            { text: "The sun shines brightly.", correct: false},
            { text: "The moon shines bright.", correct: true},
            { text: "The stars shine brightly.", correct: false},
            { text: "The sky is clear.", correct: false}
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