var pageTitle = "Meme Voting"


var memeArray = [
    {"creatorName": "Alice","memeUrl": "https://pbs.twimg.com/media/Dsdt6gOXcAAksLu.jpg","votes":18, "index":1, "rank":1, "comments":[ {"author": "Linda", "comment": "I like it!"}, { "author": "Richard", "comment": "Very funny"} ]},
    {"creatorName": "Bob","memeUrl": "https://pbs.twimg.com/media/C4Vu1S0WYAA3Clw.jpg","votes":27, "index":2, "rank":2},
    {"creatorName": "Carol","memeUrl": "https://pbs.twimg.com/media/DeHbsSAU0AAbQAq.jpg","votes":14, "index":3, "rank":3}
];

var memeCard = Vue.component('meme-card', {
    props: {
        meme: Object
    },
    data: function(){
        return {
            comments: this.meme.comments
        }
    },
    template: memeCardTemplate
});

var memeComment = Vue.component('meme-comment', {
    props: {
        comment: Object
    },
    template: memeCommentTemplate
})

var app = new Vue({
    el: '#app',
    data: {
        title: pageTitle,
        memes: memeArray,
    },
    head: {
        title: {
            inner: pageTitle,
            separator: ' ',
            complement: ' '
        }
    }
})
