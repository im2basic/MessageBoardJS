const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(session({
    secret: 'StayHumble',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
//CHANGE HERE----------------------
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/message-boards', {useNewUrlParser: true});

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "a comment must have an author"]
    },
    comment: {
            type: String,
            required: [true , "say something"]
    }
}, {timestamps:true})

const MessageSchema = new mongoose.Schema({
    name: {
    type: String,
        required: [true , "a comment must have an author"]
    },
    message: {
        type: String,
        required: [true , "say something"]
    },
    comments: [CommentSchema]

}, {timestamps:true})

const Comment = mongoose.model('Comment', CommentSchema)
const Message = mongoose.model('Message', MessageSchema)

//ROUTES
app.get('/', (req, res) => {
    Message.find()
        .then(data => res.render ('index', {message: data}))
        .catch(err=> res.json(err))
});

app.post('/messages', (req, res) => {
    Message.create(req.body)
        .then(data => res.redirect ('/'))
        .catch(err=> res.json(err))
})

app.post('/comments', (req, res) => {
    Comment.create(req.body)
        .then(data =>{
            Message.findOneAndUpdate({_id: req.body.messageId}, {$push: {comments: data}})
                .then(message => res.redirect('/'))
            .catch(err=> res.json(err))
        })
});



app.listen(8000, () => console.log("listening on port 8000"));