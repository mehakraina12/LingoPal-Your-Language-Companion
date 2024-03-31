const csrftoken = document.cookie.match(/csrftoken=([^ ;]+)/)[1];
const questions = [
    {
        question: "What does the Hindi word 'अंतरिक्ष' (antariksh) refer to?",
        answers: [
            { text: "Sky", correct: true},
            { text: "Mountain", correct: false},
            { text: "Ocean", correct: false},
        ]
    },
    {
        question: "Choose the correct synonym for the word 'संवाद' (sanvaad):",
        answers: [
            { text: "वार्ता (varta)", correct: true},
            { text: "स्वीकृति (swikriti)", correct: false},
            { text: "प्रशंसा (prashansa)", correct: false},
        ]
    },
    {
        question: "Which option best describes the meaning of the Hindi idiom 'अपना खुन पसीना बहाना' (apna khoon pasina bahana)?",
        answers: [
            { text: "To waste one's resources", correct: false},
            { text: "To strive hard and put in effort", correct: true},
            { text: "To sacrifice for others", correct: false},
        ]
    },
    {
        question: "Select the appropriate word to complete the sentence: 'मेरे दोस्त ____ किताबें पढ़ते हैं।'",
        answers: [
            { text: "ज्यादा (zyada)", correct: false},
            { text: "सभी (sabhi)", correct: true},
            { text: "कम (kam)", correct: false},
        ]
    },
    {
        question: "Which word is the antonym of 'समृद्धि' (samriddhi)?",
        answers: [
            { text: "निराशा (nirasha)", correct: true},
            { text: "प्रगति (pragati)", correct: false},
            { text: "स्वातंत्र्य (swatantrya)", correct: false},
        ]
    },
    {
        question: "Identify the passive voice form of the sentence: 'राम ने किताब पढ़ी।' (Ram ne kitaab padhi)",
        answers: [
            { text: "किताब पढ़ी गई थी राम द्वारा। (Kitaab padhi gayi thi Ram dwara.)", correct: false},
            { text: "किताब राम ने पढ़ना। (Kitaab Ram ne padhna.)", correct: false},
            { text: "किताब पढ़ी गई राम द्वारा। (Kitaab padhi gayi Ram dwara.)", correct: true},
        ]
    },
    {
        question: "What is the English translation of the Hindi sentence: 'गायिका कौन है, आपको पता है?' (Gayika kaun hai, aapko pata hai?)",
        answers: [
            { text: "Do you know who the singer is?", correct: false},
            { text: "Is the singer known to you?", correct: false},
            { text: "Who is the singer, do you know?", correct: true},
        ]
    },
    {
        question: "Choose the correct meaning of the Hindi word 'प्रशंसक' (prashansak):",
        answers: [
            { text: "Stranger", correct: false},
            { text: "Supporter", correct: true},
            { text: "Opponent", correct: false},
        ]
    },
    {
        question: "Which word means 'education' in Hindi?",
        answers: [
            { text: "शिक्षा (shiksha)", correct: true},
            { text: "खेल (khel)", correct: false},
            { text: "व्यापार (vyaapar)", correct: false},
        ]
    },
    {
        question: "Choose the correct synonym for the word 'प्रशासन' (prashasan):",
        answers: [
            { text: "संगठन (sangathan)", correct: true},
            { text: "सहायक (sahayak)", correct: false},
            { text: "विद्यालय (vidyalay)", correct: false},
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
            'lang': 'Hindi',
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