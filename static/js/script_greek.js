const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Greek word for 'hello'?",
        answers: [
            { text: "Καλημέρα (Kaliméra)", correct: true},
            { text: "Χαίρετε (Chaírete)", correct: false},
            { text: "Γειά σας (Yiá sas)", correct: false},
        ]
    },
    {
        question: "Which verb is used to express 'to have' in Greek?",
        answers: [
            { text: "Έχω (Écho)", correct: true},
            { text: " Πίνω (Píno)", correct: false},
            { text: "Πάω (Páo)", correct: false},
        ]
    },
    {
        question: "What is the Greek word for 'cat'?",
        answers: [
            { text: "Τραπέζι (Trapézi)", correct: false},
            { text: "Γάτα (Gáta)", correct: true},
            { text: "Σκύλος (Skýlos)", correct: false},
        ]
    },
    {
        question: "How do you say 'goodbye' in Greek?",
        answers: [
            { text: "Εις το επανιδείν (Eis to epanideín)", correct: false},
            { text: "Αντίο (Adío)", correct: true},
            { text: "Ελάτε πάλι (Eláte páli)", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct translation for 'apple' in Greek?",
        answers: [
            { text: "Μήλο (Mílo)", correct: true},
            { text: "Μπανάνα (Banána)", correct: false},
            { text: "Φράουλα (Fráoula)", correct: false},
        ]
    },
    {
        question: "What does 'παρακαλώ' (parakaló) mean in English?",
        answers: [
            { text: "Thank you", correct: false},
            { text: "You're welcome", correct: false},
            { text: "Excuse me", correct: true},
        ]
    },
    {
        question: "How do you say 'thank you' in Greek?",
        answers: [
            { text: "Παρακαλώ (Parakaló)", correct: false},
            { text: "Συγνώμη (Sygnómi)", correct: false},
            { text: "Ευχαριστώ (Efcharistó)", correct: true},
        ]
    },
    {
        question: "Which of the following expressions means 'How are you?' in Greek?",
        answers: [
            { text: "Πού μένεις; (Poú méneis?)", correct: false},
            { text: "Τι κάνεις; (Ti kánis?)", correct: true},
            { text: "Τι κάνετε; (Ti kánete?)", correct: false},
        ]
    },
    {
        question: "What is the Greek word for 'book'?",
        answers: [
            { text: "Βιβλίο (Vivlío)", correct: true},
            { text: "Κρεβάτι (Kreváti)", correct: false},
            { text: "Ποτήρι (Potíri)", correct: false},
        ]
    },
    {
        question: "What is the meaning of the Greek word 'φιλοξενία' (filoxenía)?",
        answers: [
            { text: "Hospitality", correct: true},
            { text: "Love for knowledge", correct: false},
            { text: "Self-reflection", correct: false},
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
        message = "<br><span style='color: green; font-size: small;'>We are pleased to inform you that you have been selected to teach. Your proficiency in this language meet our standards, and we believe you will be an excellent addition to our team of instructors.</span>";
    } else {
        message = "<br><span style='color: red; font-size: small;'>We regret to inform you that we are unable to offer you to teach at this time, as our instructors must meet specific proficiency standards which you do not currently fulfill.</span>";
    }
    message += "<br><br>You may close the tab now";
    questionElement.innerHTML = `Thank you for attempting the quiz.<br>You scored ${score} out of ${questions.length}!<br>${message}`;

    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'Greek',
            'score': score,
        },
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrftoken  // Include CSRF token in headers
        }
    })
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