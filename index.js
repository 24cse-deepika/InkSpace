import express from "express";
import 'dotenv/config'; // loads .env variables into process.env
import axios from 'axios'; // HTTP client for Pexels API requests
import fs from 'fs'; // file system module for JSON persistence

const app = express();
const port = process.env.PORT || 3000;

// serve static files (CSS, JS) from the public folder
app.use(express.static("public"));
// parse URL-encoded form submissions (req.body)
app.use(express.urlencoded({ extended: true }));

// placeholder "logged in" user — replaced by real auth in future
let currentUser = "";

// load posts from JSON file on startup; fall back to seed data if file doesn't exist
let posts;
try {
  posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
} catch {
    posts = [ /* seed data */ ];
}

// write current posts array to disk after every mutation
function savePosts() {
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
}

// home page — renders all posts for display
app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts, username: currentUser });
});

// welcome page — simple name-based login placeholder
app.get("/welcome", (req, res) => {
    res.render("welcome.ejs", { username: currentUser });
});

// set the current user from form submission and redirect home
app.post("/welcome", (req, res) => {
    const { username } = req.body;
    if (username && username.trim() !== "") {
        currentUser = username.trim();
    }
    res.redirect("/");
});

// render blank post creation form
app.get("/write-blog", (req, res) => {
    res.render("write-blog.ejs", { username: currentUser });
});

// create a new post and persist it
app.post("/write-blog", (req, res) => {
    const { title, content, tags, status, bannerUrl } = req.body;

    // redirect back if title is empty
    if (!title || title.trim() === "") {
        return res.redirect("/write-blog");
    }

    const newPost = {
        id: posts.length + 1,
        title: title,
        content: content ? content.replace(/\r\n/g, '\n').trim() : '', // normalize line endings
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        author: currentUser || "Anonymous",
        date: new Date().toISOString().split("T")[0],
        status: status, // "draft" or "published"
        bannerUrl: bannerUrl // Pexels photo URL selected by user
    };

    posts.push(newPost);
    savePosts();
    res.redirect("/");
});

// render single post detail page
app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.redirect("/");
    res.render("post.ejs", { post: post, username: currentUser });
});

// render all posts for the author's dashboard
app.get("/my-work", (req, res) => {
    res.render("my-work.ejs", { posts: posts, username: currentUser });
});

// delete a post by id and persist the updated array
app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== id);
    savePosts();
    res.redirect("/my-work");
});

// render edit form pre-populated with existing post data
app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.redirect("/my-work");
    res.render("write-blog.ejs", { post: post, username: currentUser });
});

// update an existing post and persist changes
app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, tags, status, bannerUrl } = req.body;
    const post = posts.find(p => p.id === id);
    if (!post) return res.redirect("/my-work");

    post.title = title;
    post.content = content ? content.replace(/\r\n/g, '\n').trim() : '';
    post.tags = tags ? tags.split(",").map(t => t.trim()) : [];
    post.status = status;
    post.bannerUrl = bannerUrl || post.bannerUrl; // keep existing banner if not updated

    savePosts();
    res.redirect("/my-work");
});

// render the Pexels photo search page for banner selection
app.get('/create-banner', (req, res) => {
  res.render('create-banner.ejs');
});

// proxy endpoint for Pexels API — keeps API key server-side
app.get('/api/photos', async (req, res) => {
  try {
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