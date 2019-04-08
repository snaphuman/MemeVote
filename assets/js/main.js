var pageTitle = "Meme Voting"


var memeCard = Vue.component('meme-card', {
    template: memeCardTemplate
});

var memeComment = Vue.component('meme-comment', {
    template: memeCommentTemplate
})

var app = new Vue({
    el: '#app',
    data: {
        title: pageTitle
    },
    head: {
        title: {
            inner: pageTitle,
            separator: ' ',
            complement: ' '
        }
    }
})
