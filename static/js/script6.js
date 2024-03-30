const questions = [
    {
        question: "Which of the following is the correct translation of 'apple' in Bengali?",
        answers: [
            { text: "আপেল", correct: true},
            { text: "আম", correct: false},
            { text: "পেঁপে", correct: false},
        ]
    },
    {
        question: "Which of the following is the correct translation of 'sunshine' into Bengali?",
        answers: [
            { text: "প্রকাশ", correct: false},
            { text: "আলো", correct: true},
            { text: "রঙিন", correct: false},
        ]
    },
    {
        question: "Which of the following proverbs translates to 'যত্নের প্রথম টুকরা নয়' in Bengali?",
        answers: [
            { text: "A stitch in time saves nine.", correct: false},
            { text: "Better late than never.", correct: true},
            { text: "Early bird catches the worm.", correct: false},
        ]
    },
    {
        question: "Which of the following Bengali words means 'friend'?",
        answers: [
            { text: "বন্ধু", correct: true},
            { text: "শত্রু", correct: false},
            { text: "প্রিয় ", correct: false},
        ]
    },
    {
        question: "In Bengali grammar, which tense is formed using the auxiliary verb 'গেলে' (gele)?",
        answers: [
            { text: "Past continuous", correct: false},
            { text: "Future perfect", correct: false},
            { text: "Past perfect", correct: true},
        ]
    },
    {
        question: "Choose the appropriate preposition to complete the sentence: 'তিনি সমুদ্রে _____ পড়লেন' (He fell into the sea).",
        answers: [
            { text: "সঙ্গে", correct: true},
            { text: "দ্বারা", correct: false},
            { text: "বাহনে", correct: false},
        ]
    },
    {
        question: "What is the Bengali word for 'rain'?",
        answers: [
            { text: "বৃষ্টি (bristi)", correct: true},
            { text: "তুষার (tushar)", correct: false},
            { text: "আলো (alo)", correct: false},
        ]
    },
    {
        question: "In Bengali grammar, which case particle is used to indicate the direct object?",
        answers: [
            { text: " কে (ke)", correct: true},
            { text: "কেক (kek)", correct: false},
            { text: " কেকে (keke)", correct: false},
        ]
    },
    {
        question: "What does the Bengali phrase 'মাঝে মাঝে' (majhe majhe) commonly signify?",
        answers: [
            { text: "In the middle", correct: false},
            { text: "Every time", correct: false},
            { text: "Occasionally", correct: true},
        ]
    },
    {
        question: "Choose the appropriate word to complete the sentence: 'তিনি রোজ ______ পড়তে থাকেন' (Tini roj ______ porate thaken).",
        answers: [
            { text: "কম্পিউটার (computer)", correct: false},
            { text: "বই (book)", correct: true},
            { text: "গান (song)", correct: false},
        ]
    },

];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentquestionindex = 0;
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

function showScore() {
    resetState();
    let message = "";
    if (score >= 8) {
        message = "Accepted";
    } else {
        message = "Rejected";
    }
    questionElement.innerHTML = `Thank you for attempting the quiz. You may exit the quiz now.<br>You scored ${score} out of ${questions.length}!<br>${message}`;
    nextButton.innerHTML = "Exit";
    nextButton.style.display = "block";
}


function handleNextButton(){
    currentquestionindex++;
    if(currentquestionindex<questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentquestionindex < questions.length) {
        handleNextButton();
    } else {
        // Instead of starting the quiz again, go back to the previous page
        history.back();
    }
});

startQuiz();