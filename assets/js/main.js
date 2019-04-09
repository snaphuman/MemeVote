const contractAddress = 'ct_2qcqwwXmfLmZ3a18yvnv4p8ta9HGoyHRjCDvPMvyAqkuMRwzPD';

var client = null;

var memeArray = [];

var memesLength = 0;

var commentsArray = [];

var pageTitle = "Meme Voting"

/**
var memeArray = [
    {"creatorName": "Alice","memeUrl": "https://pbs.twimg.com/media/Dsdt6gOXcAAksLu.jpg","votes":18, "index":1, "rank":1, "comments":[ {"author": "Linda", "comment": "I like it!"}, { "author": "Richard", "comment": "Very funny"} ]},
    {"creatorName": "Bob","memeUrl": "https://pbs.twimg.com/media/C4Vu1S0WYAA3Clw.jpg","votes":27, "index":2, "rank":2},
    {"creatorName": "Carol","memeUrl": "https://pbs.twimg.com/media/DeHbsSAU0AAbQAq.jpg","votes":14, "index":3, "rank":3}
];
*/


var memeCard = Vue.component('meme-card', {
    props: {
        meme: Object
    },
    data: function(){
        return {
            comments: this.meme.comments
        };
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
    mounted: function(){
        this.loadAEClient();
    },
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
    },
    methods: {
        async loadAEClient () {
            client = await Ae.Aepp();

            const calledGet = await client.contractCallStatic(contractAddress, 'sophia-address', 'getMemesLength', {args: '()'}).catch(e => console.error(e));
            console.log('calledGet', calledGet);
        }
    }
})
