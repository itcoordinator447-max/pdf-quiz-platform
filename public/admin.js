async function upload(){

let file=document.getElementById("pdf").files[0]

let formData=new FormData()

formData.append("file",file)

let res=await fetch("/upload",{
method:"POST",
body:formData
})

let data=await res.json()

document.getElementById("link").innerHTML=
"Share this quiz link: "+window.location.origin + data.link


}
