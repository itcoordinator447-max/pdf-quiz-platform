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

let resultHTML=`<h2>Score: ${data.score} / ${data.total}</h2>`

data.details.forEach((r,i)=>{

resultHTML+=`
<hr>
<p><b>${r.question}</b></p>
<p>Your Answer: ${r.student || "Not answered"}</p>
<p>Correct Answer: ${r.correct}</p>
`

})

document.body.innerHTML=resultHTML

})

}