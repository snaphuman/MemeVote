const pageTitle = "Meme Voting"

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
