import express from "express";
import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// In-memory "logged in" user (placeholder until real auth is added)
let currentUser = "";

// In-memory posts store
let posts;
try {
  posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
} catch {
    posts = [
        {
            id: 1,
            title: "My First Hackathon",
            content: "It was chaos. Beautiful chaos. I learned so much and met amazing people. Can't wait for the next one! The experience was unforgettable, and I can't wait to do it again. The energy, the creativity, and the camaraderie were incredible. I left with new skills, new friends, and a renewed passion for coding. Hackathons are truly a unique experience that every developer should try at least once.",
            tags: ["Hackathon", "Experience"],
            author: "Deepika",
            date: "2026-06-12",
            status: "published"
        },
        {
            id: 2,
            title: "Why I Switched to a Minimalist Desk Setup",
            content: "After years of cable chaos and clutter, I finally decided to strip everything down. One monitor, one notebook, one plant. The difference in focus has been incredible — fewer distractions mean more deep work. I used to think more gadgets meant more productivity, but it turns out the opposite is true for me. Sometimes less really is more.",
            tags: ["Productivity", "Lifestyle"],
            author: "Aman",
            date: "2026-05-28",
            status: "published"
        },
        {
            id: 3,
            title: "A Weekend Trip to the Mountains",
            content: "We packed our bags on a whim and drove up to the hills with no real plan. The air was crisp, the views were endless, and for the first time in months I felt completely disconnected from my inbox. Sometimes the best trips are the ones you don't overthink. We hiked, we cooked over a fire, and we watched the stars without a single notification buzzing.",
            tags: ["Travel", "Mountains"],
            author: "Riya",
            date: "2026-06-05",
            status: "draft"
        }
    ];
}

function savePosts() {
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
}

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts, username: currentUser });
});

// Placeholder "login" page — just asks for a name for now
app.get("/welcome", (req, res) => {
    res.render("welcome.ejs", { username: currentUser });
});

app.post("/welcome", (req, res) => {
    const { username } = req.body;
    if (username && username.trim() !== "") {
        currentUser = username.trim();
    }
    res.redirect("/");
});

app.get("/write-blog", (req, res) => {
    res.render("write-blog.ejs", { username: currentUser });
});

app.post("/write-blog", (req, res) => {
    const { title, content, tags, status, bannerUrl } = req.body;

    if (!title || title.trim() === "") {
        return res.redirect("/write-blog");
    }

    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content ? content.replace(/\r\n/g, '\n').trim() : '',
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        author: currentUser || "Anonymous",
        date: new Date().toISOString().split("T")[0],
        status: status,
        bannerUrl: bannerUrl
    };

    posts.push(newPost);
    savePosts();
    res.redirect("/");
});

app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.redirect("/");
    res.render("post.ejs", { post: post, username: currentUser });
});

app.get("/my-work", (req, res) => {
    res.render("my-work.ejs", { posts: posts, username: currentUser });
});

app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== id);
    savePosts();
    res.redirect("/my-work");
});

app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.redirect("/my-work");
    res.render("write-blog.ejs", { post: post, username: currentUser });
});

app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, tags, status, bannerUrl } = req.body;
    const post = posts.find(p => p.id === id);
    if (!post) return res.redirect("/my-work");

    post.title = title;
    post.content = content ? content.replace(/\r\n/g, '\n').trim() : '';
    post.tags = tags ? tags.split(",").map(t => t.trim()) : [];
    post.status = status;
    post.bannerUrl = bannerUrl || post.bannerUrl; // Keep existing banner if not updated

    savePosts();
    res.redirect("/my-work");
});

app.get('/create-banner', (req, res) => {
  res.render('create-banner.ejs');
});

app.get('/api/photos', async (req, res) => {

  try{
      const { query, page = 1, per_page = 16, orientation = 'landscape' } = req.query;
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=${per_page}&orientation=${orientation}`,
        { headers: { Authorization: process.env.PEXELS_API_KEY } }
      );
      res.json(response.data.photos);
  } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});