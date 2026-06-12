import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
});

app.get("/write-blog", (req, res) => {
    res.render("write-blog.ejs");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

let posts = [
    {
        id: 1,
        title: "My First Hackathon",
        content: "It was chaos. Beautiful chaos.",
        tags: ["Hackathon", "Experience"],
        author: "Deepika",
        date: "2026-06-12",
        status: "published"
    }
];