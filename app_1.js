//counter

const express = require('express');
const path = require('path')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect("mongodb://lazyin1004:123456@mongodb-2628-0.cloudclusters.net:10003/test?authSource=admin")
var db = mongoose.connection
db.once("open", function () {
    console.log("DB connected:")
});
db.on("error", function (err) {
    console.log("DB ERROR:", err);
});

// model setting
var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});
var Post = mongoose.model('post', postSchema)

//view setting
app.set('view engine', 'ejs');

//set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// 루트 설정
app.get('/posts', function (req, res) {
    Post.find({}).sort('-createdAt').exec(function (err, posts) {
        if (err) return res.json({ success: false, message: err });
        res.render("posts/index", { data: posts });
    });
});//index
app.post('/posts', function (req, res) {
    Post.create(req.body.post, function (err, post) {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, data: post });
    });
});//생성
app.get('/posts/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, data: post });
    });
});//show
app.put('/posts/:id', function (req, res) {
    req.body.post.updatedAt = Date.now();
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, post) {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, message: post._id + " updated" });
    });
});//update
app.delete('/post/:id', function (req, res) {
    Post.findOneAndRemove(req.params.id, function (err, post) {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, message: post._id + "deleted" })
    })
})

app.listen(3000, function () {
    console.log('server on!')
});