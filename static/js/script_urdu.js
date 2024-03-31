const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "Which phrase means 'Can you help me?' in Urdu?",
        answers: [
            { text: "کیا آپ میری مدد کر سکتے ہیں؟", correct: true},
            { text: "آپ کیا کر رہے ہیں؟", correct: false},
            { text: "میں کیا کر سکتا ہوں؟", correct: false},
        ]
    },
    {
        question: "What does 'براہ کرم وہاں جائیں' mean in English?",
        answers: [
            { text: "Please go there.", correct: true},
            { text: "Please come here.", correct: false},
            { text: "Please wait here.", correct: false},
        ]
    },
    {
        question: "Which phrase means 'Please speak slowly' in Urdu?",
        answers: [
            { text: "براہ کرم جلدی بولیں", correct: false},
            { text: "براہ کرم آہستہ بولیں", correct: true},
            { text: "براہ کرم چپ رہیں", correct: false},
        ]
    },
    {
        question: "Which phrase means 'Excuse me' in Urdu when trying to get someone's attention?",
        answers: [
            { text: "کرپایہ (Kirpaya)", correct: false},
            { text: "معاف کیجئے (Maaf kijiyay)", correct: true},
            { text: "کوئی بات نہیں (Koi baat nahi)", correct: false},
        ]
    },
    {
        question: "What is the Urdu word for 'Teacher'?",
        answers: [
            { text: "معلم (Mualim)", correct: true},
            { text: "استاد (Ustaad)", correct: false},
            { text: "شاگرد (Shagird)", correct: false},
        ]
    },
    {
        question: "What does 'یہ کتنے کا ہے؟' mean in English?",
        answers: [
            { text: "What's your name?", correct: false},
            { text: "Where is the bathroom?", correct: false},
            { text: "How much does this cost?", correct: true},
        ]
    },
    {
        question: "What is the Urdu word for 'School'?",
        answers: [
            { text: "کلب (Kalab)", correct: false},
            { text: "ہائی سکول (High School)", correct: false},
            { text: "مکتب (Maktab)", correct: true},
        ]
    },
    {
        question: "What is the Urdu word for 'Hospital'?",
        answers: [
            { text: "دواخانہ (Dawakhana)", correct: false},
            { text: "بیمارستان (Bemaristan)", correct: true},
            { text: "علاج (Ilaj)", correct: false},
        ]
    },
    {
        question: "What is the Urdu word for 'Time'?",
        answers: [
            { text: "وقت (Waqt)", correct: true},
            { text: "موقع (Mauqa)", correct: false},
            { text: "زمانہ (Zamana)", correct: false},
        ]
    },
    {
        question: "What is the Urdu word for 'Problem'?",
        answers: [
            { text: "مسئلہ (Mas'ala)", correct: true},
            { text: "مشکل (Mushkil)", correct: false},
            { text: "حل (Hal)", correct: false},
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
            'lang': 'Urdu',
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