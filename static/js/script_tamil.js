const questions = [
    {
        question: "Which of the following is the correct translation for 'innovation' in Tamil?",
        answers: [
            { text: "புதிய பொருள் (putiya porul)", correct: true},
            { text: "புதிய வளம் (putiya valam)", correct: false},
            { text: "முதலிகள் (mudaligal)", correct: false},
        ]
    },
    {
        question: "What does 'மக்கள்' (makkal) mean in English?",
        answers: [
            { text: "People", correct: true},
            { text: "Civilization", correct: false},
            { text: "Culture", correct: false},
        ]
    },
    {
        question: "Which of the following is a correct translation for 'environment' in Tamil?",
        answers: [
            { text: "அடையாளம் (adaiyaalam)", correct: false},
            { text: "சுற்றுச்சூழல் (sutruchchuzhal)", correct: true},
            { text: "சிந்தனை (sindhanai)", correct: false},
        ]
    },
    {
        question: "What is the Tamil word for 'sustainability'?",
        answers: [
            { text: "நிரந்தர உதவி (niranthara udhavi)", correct: false},
            { text: "தொழில் முறைமை (thozhil muraimai)", correct: true},
            { text: "நெருக்கம் (nerukkam)", correct: false},
        ]
    },
    {
        question: "Which phrase means 'global warming' in Tamil?",
        answers: [
            { text: "உலக வெப்பநிலை (ulaga veppanilai)", correct: true},
            { text: "புயல் மழை (puyal mazhai)", correct: false},
            { text: "பறவை போல் (paravai pol)", correct: false},
        ]
    },
    {
        question: "What is the Tamil word for 'entrepreneur'?",
        answers: [
            { text: "விவசாயி (vivasayi)", correct: false},
            { text: "உத்தியை நிறுத்து (uttiyai niruthu)", correct: false},
            { text: "பொருள் முறையாளர் (porul muraiyaalar)", correct: true},
        ]
    },
    {
        question: "What does 'படைப்பு' (padippu) mean in English?",
        answers: [
            { text: "Development", correct: false},
            { text: "Achievement", correct: false},
            { text: "Education", correct: true},
        ]
    },
    {
        question: "Which of the following is the correct translation for 'biodiversity' in Tamil?",
        answers: [
            { text: "உழவு (uzhavu)", correct: false},
            { text: "விலங்கு வகைமை (vilangu vakaimai)", correct: true},
            { text: "உயிரினம் (uyirinam)", correct: false},
        ]
    },
    {
        question: "Which phrase means 'climate change' in Tamil?",
        answers: [
            { text: "வானிலை மாற்றம் (vaanilai maatram)", correct: true},
            { text: "அம்சங்கள் மாற்றம் (amsangal maatram)", correct: false},
            { text: "வானிலை உயிரினம் (vaanilai uyirinam)", correct: false},
        ]
    },
    {
        question: "What is the Tamil word for 'conservation'?",
        answers: [
            { text: "பாதுகாப்பு (paathukaappu)", correct: true},
            { text: "உழவுக்காப்பு (uzhavukkaappu)", correct: false},
            { text: "உழவாய் (uzhavaay)", correct: false},
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
            'lang': 'Tamil',
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