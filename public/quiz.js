let resultDetails=[]
let currentScore=0
let currentTotal=0
const params=new URLSearchParams(window.location.search)

const quizId=params.get("id")

let questions=[]

fetch("/quiz/"+quizId)
.then(res=>res.json())
.then(data=>{

questions=data

let html=""

data.forEach((q,i)=>{

html+=`
<p><b>${q.question}</b></p>

<label><input type="radio" name="q${i}" value="A"> ${q.options[0]||"A"}</label><br>
<label><input type="radio" name="q${i}" value="B"> ${q.options[1]||"B"}</label><br>
<label><input type="radio" name="q${i}" value="C"> ${q.options[2]||"C"}</label><br>
<label><input type="radio" name="q${i}" value="D"> ${q.options[3]||"D"}</label>

<br><br>
`

})

document.getElementById("quiz").innerHTML=html

})

function submitQuiz(){

let answers=[]

questions.forEach((q,i)=>{

let selected=document.querySelector(`input[name="q${i}"]:checked`)

answers.push(selected?selected.value:"")

})

fetch("/submit",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
quizId:quizId,
answers:answers
})
})
.then(res=>res.json())
.then(data=>{
  currentScore=data.score
currentTotal=data.total
resultDetails=data.details

let resultHTML=`<h2>Score: ${data.score} / ${data.total}</h2>`

data.details.forEach((r,i)=>{

let studentText = r.student
  ? r.options[r.student.charCodeAt(0) - 65]
  : "Not answered";

let correctText = r.options[r.correct.charCodeAt(0) - 65];

resultHTML += `
<hr>
<p><b>${r.question}</b></p>
<p>Your Answer: ${r.student || ""} ${studentText}</p>
<p>Correct Answer: ${r.correct} ${correctText}</p>
`;

})

document.body.innerHTML = resultHTML + `
<br><br>
<button onclick="downloadPDF()">Download Result PDF</button>
`;

})


}
function downloadPDF(){
  doc.addImage("logo.png","PNG",40,80,120,120);
doc.setGState(new doc.GState({opacity:0.1}));

const { jsPDF } = window.jspdf

let doc = new jsPDF()

let y = 20

doc.setFontSize(16)
doc.text("Quiz Result", 90, 10)

doc.setFontSize(12)
doc.text("Student: " + studentName, 10, y)
y += 10

doc.text("Score: " + currentScore + "/" + currentTotal, 10, y)
y += 10

resultDetails.forEach((r,i)=>{

let studentText = r.student
? r.options[r.student.charCodeAt(0) - 65]
: "Not answered"

let correctText = r.options[r.correct.charCodeAt(0) - 65]

doc.text((i+1)+". "+r.question,10,y)
y+=7

doc.text("Your Answer: "+studentText,10,y)
y+=7

doc.setTextColor(0,150,0)
doc.text("Correct Answer: "+correctText,10,y)

doc.setTextColor(0,0,0)

y+=10

if(y>270){
doc.addPage()
y=20
}

})

doc.save(studentName+"_quiz_result.pdf")

}
