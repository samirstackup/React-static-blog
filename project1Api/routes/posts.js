const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE NEW POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save(); //must use await or response posts but is empty
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //Need to write await to make it work
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //Need to write await to make it work
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id); // Pass the ID to delete
        res.status(200).json("Post deleted");
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET POST
// router.get("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// GET POST BY ID
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// SEARCH POSTS BY QUERY
router.get("/", async (req, res) => {
  const searchQuery = req.query.search;
  const username = req.query.user;
  const category = req.query.cat;

  try {
    let posts;

    if (searchQuery) {
      // If there's a search query, filter posts based on the query
      posts = await Post.find({ $text: { $search: searchQuery } });
    } else if (username) {
      // If there's a username, filter posts by username
      posts = await Post.find({ username });
    } else if (category) {
      // If there's a category, filter posts by category
      posts = await Post.find({ categories: { $in: [category] } });
    } else {
      // If there's no search query, username, or category, return all posts
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const category = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await posts.find({
        categories: {
          $in: [category],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
