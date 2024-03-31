const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What is the Telugu word for 'Hello'?",
        answers: [
            { text: "నమస్తే (Namaste)", correct: true},
            { text: "శుభోదయం (Shubhodayam)", correct: false},
            { text: "హలో (Halo)", correct: false},
        ]
    },
    {
        question: "What does 'మీరు ఏమి చేస్తున్నారు?' mean in English?",
        answers: [
            { text: "What are you doing?", correct: true},
            { text: "Where are you from?", correct: false},
            { text: "What's your name?", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Thank you' in Telugu?",
        answers: [
            { text: "ప్రత్యేక కలిగి (Pratyēka kaligi)", correct: false},
            { text: "ధన్యవాదాలు (Dhanyavādālu)", correct: true},
            { text: "సంతోషం (Santōṣam)", correct: false},
        ]
    },
    {
        question: "What is the Telugu word for 'Goodbye'?",
        answers: [
            { text: "క్షమించండి (Kṣamiṅcaṇḍi)", correct: false},
            { text: "విడిచి పోవు (Viḍici pōvu)", correct: true},
            { text: "విశ్రాంతి (Viśrānti)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Yes' in Telugu?",
        answers: [
            { text: "అవును (Avunu)", correct: true},
            { text: "అవసరం (Avasaraṁ)", correct: false},
            { text: "కాదు (Kādu)", correct: false},
        ]
    },
    {
        question: "Which of the following means 'I'm sorry' in Telugu?",
        answers: [
            { text: "మాఫీ చాలా (Māfī cālā)", correct: false},
            { text: "మీరు సరదాగా ఉన్నారు (Mīru saradāgā unnāru)", correct: false},
            { text: "క్షమించండి (Kṣamiṅcaṇḍi)", correct: true},
        ]
    },
    {
        question: "Which phrase means 'Please' in Telugu?",
        answers: [
            { text: "ఆపండి (Āpaṇḍi)", correct: false},
            { text: "సహాయం చేయండి (Sahāyaṁ cēyaṇḍi)", correct: false},
            { text: "దయచేసి (Dayacēsi)", correct: true},
        ]
    },
    {
        question: "What does 'నా పేరు గోపాల్' mean in English?",
        answers: [
            { text: "What's your name?", correct: false},
            { text: "My name is Gopal.", correct: true},
            { text: "Where are you from?", correct: false},
        ]
    },
    {
        question: "Which of the following means 'Excuse me' in Telugu?",
        answers: [
            { text: "క్షమించండి (Kṣamiṅcaṇḍi)", correct: true},
            { text: "ప్రార్థన చేయండి (Prārthana cēyaṇḍi)", correct: false},
            { text: "దయచేసి (Dayacēsi)", correct: false},
        ]
    },
    {
        question: "What is the Telugu word for 'Food'?",
        answers: [
            { text: "ఆహారం (Āhāraṁ)", correct: true},
            { text: "పెరుగు (Perugu)", correct: false},
            { text: "ఆరోగ్యం (Ārōgyaṁ)", correct: false},
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

    $.ajax({
        url: '/result_update',
        type: 'POST',
        data: {
            'lang': 'Telugu',
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