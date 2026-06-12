# InkSpace

InkSpace is a lightweight blogging platform where users can write, edit, publish, and manage blog posts through a clean, distraction-free interface. Built as a capstone project using **Node.js**, **Express.js**, and **EJS**, with custom CSS styling for a responsive experience across desktop and mobile.

> ⚠️ **Note:** This version stores posts in memory only. All posts are reset when the server restarts — no database is used.

## Features

- **Create Posts** — Write new blog posts with a title, content, and comma-separated tags.
- **View Posts** — Browse all published posts on the home page, and read the full post on its own page.
- **Edit Posts** — Update the title, content, tags, or status of an existing post.
- **Delete Posts** — Remove posts you no longer want, with a confirmation prompt.
- **Drafts & Published** — Save a post as a draft or publish it immediately; manage both from the "My Work" page.
- **Responsive Design** — A clean, two-column layout with a fixed sidebar that adapts to smaller screens.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web server and routing
- **EJS** — Templating engine for dynamic HTML
- **CSS** — Custom styling (no frameworks)

## Project Structure

```
InkSpace/
├── index.js                  # Express server & routes
├── package.json
├── public/
│   └── styles/
│       └── main.css          # Application styling
└── views/
    ├── index.ejs              # Home page (published posts)
    ├── write-blog.ejs         # Create / edit post form
    ├── my-work.ejs            # Manage drafts & published posts
    ├── post.ejs                # Single post view
    └── partials/
        ├── header.ejs          # Shared header & navigation
        └── footer.ejs          # Shared footer & scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node index.js
   ```

4. Open your browser and go to:

   ```
   http://localhost:3000
   ```

## Usage

| Page | Route | Description |
|---|---|---|
| Home | `/` | View all published posts |
| Write Blog | `/write-blog` | Create a new post (save as draft or publish) |
| My Work | `/my-work` | View, edit, and delete drafts and published posts |
| Post Detail | `/post/:id` | View a single published post |
| Edit Post | `/edit/:id` | Edit an existing post |

## Routes Overview

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Render home page with published posts |
| GET | `/write-blog` | Render the new post form |
| POST | `/write-blog` | Create a new post |
| GET | `/post/:id` | View a single post |
| GET | `/my-work` | Render dashboard of drafts & published posts |
| GET | `/edit/:id` | Render edit form for a post |
| POST | `/edit/:id` | Update an existing post |
| POST | `/delete/:id` | Delete a post |

## Future Improvements

- Persist posts using a database (e.g., MongoDB, PostgreSQL, or SQLite)
- User authentication for multiple authors
- Search and filtering by tags
- Rich text / Markdown support for post content

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.