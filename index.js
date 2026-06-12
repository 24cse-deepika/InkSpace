import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
});

app.get("/write-blog", (req, res) => {
    res.render("write-blog.ejs");
});

app.post("/write-blog", (req, res) => {
    const { title, content, tags, status } = req.body;

    if(!title || title.trim() === "") {
        return res.redirect("/write-blog");
    }
    
    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        author: "Deepika",
        date: new Date().toISOString().split("T")[0],
        status: status
    };
    
    posts.push(newPost);
    res.redirect("/");
});

app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if(!post) return res.redirect("/");
    res.render("post.ejs", { post: post });
});

app.get("/my-work", (req, res) => {
    res.render("my-work.ejs", { posts: posts });
});

app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== id);
    res.redirect("/my-work");
});

app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if(!post) return res.redirect("/my-work");
    res.render("write-blog.ejs", { post: post });
});

app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, tags, status } = req.body;
    const post = posts.find(p => p.id === id);
    if(!post) return res.redirect("/my-work");
    
    post.title = title;
    post.content = content;
    post.tags = tags ? tags.split(",").map(t => t.trim()) : [];
    post.status = status;
    
    res.redirect("/my-work");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


let posts = [
    {
        id: 1,
        title: "My First Hackathon",
        content: "It was chaos. Beautiful chaos. I learned so much and met amazing people. Can't wait for the next one! The experience was unforgettable, and I can't wait to do it again. The energy, the creativity, and the camaraderie were incredible. I left with new skills, new friends, and a renewed passion for coding. Hackathons are truly a unique experience that every developer should try at least once.",
        tags: ["Hackathon", "Experience"],
        author: "Deepika",
        date: "2026-06-12",
        status: "published"
    }
];