const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(fileUpload());

let quizzes = {};

app.post("/upload", async (req, res) => {

    const file = req.files.file;
    const data = await pdf(file.data);

    const lines = data.text.split("\n").map(l => l.trim()).filter(l => l !== "");

    let questions = [];
    let current = null;

    lines.forEach(line => {

        if (line.match(/^\d+\./)) {

            if (current) questions.push(current);

            current = {
                question: line,
                options: [],
                answer: "A"
            };

        } else if (line.startsWith("A.")) {

            current.options.push(line);

        } else if (line.startsWith("B.")) {

            current.options.push(line);

        } else if (line.startsWith("C.")) {

            current.options.push(line);

        } else if (line.startsWith("D.")) {

            current.options.push(line);

        }

    });

    if (current) questions.push(current);

    const id = uuidv4();

    quizzes[id] = questions;

    res.json({
       link: `/quiz.html?id=${id}`
    });

});

app.get("/quiz/:id", (req, res) => {
    res.json(quizzes[req.params.id]);
});

app.post("/submit", (req, res) => {

    const { quizId, answers } = req.body;

    let questions = quizzes[quizId];

    let score = 0;
    let details = [];

    questions.forEach((q, i) => {

        let correct = q.answer || "A";
        let student = answers[i] || "";

        if (student === correct) score++;

        details.push({
            question: q.question,
            correct: correct,
            student: student
        });

    });

    res.json({
        score: score,
        total: questions.length,
        details: details
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");

});
