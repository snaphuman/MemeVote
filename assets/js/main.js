var memeArray = [];

var memesLength = 0;

var commentArray = [];

var pageTitle = "Meme Voting";

var aeternityMixin = {
    data: {
        client: {},
        contractInstance: null,
    },
    methods: {
        async callAEContract(func, args, value) {
            this.isLoading = true;

            const calledSet = await this.contractInstance.call(func, args, {amount: value}).catch(e => console.error(e));
            this.isLoading = false;
            return calledSet;
        },
        async callAEStatic (func, args, types) {
            this.isLoading = true;
            const calledGet = await this.contractInstance.call(func, args, {callStatic: true})
                  .catch(e => console.error(e));

            const decodedGet = await calledGet.decode()
                  .catch(e => console.error(e));

            console.log(decodedGet);

            this.isLoading = false;
            return decodedGet;
        },
        async getContractInstance() {
                this.contractInstance = await this.client.getContractInstance(settings.contractSource, { contractAddress: settings.contractAddress });
        },
        async getClient() {

            this.isLoading = true;

            try {
                this.client = await Ae.Aepp({
                    parent: this.runningInFrame ? window.parent : await this.getReverseWindow()
                });

            } catch (err) {
                console.log(err);
            }

            this.isLoading = false;
        }
    }
}

var memeCard = Vue.component('meme-card', {
    mixins: [aeternityMixin],
    props: {
        meme: Object,
        client: Object
    },
    data: function(){
        return {
            voteValue: null,
            isLoading: false,
            comment: "",
            commentAuthor: "",
            comments: this.meme.comments
        };
    },
    template: memeCardTemplate,
    methods: {
       async voteMeme (event) {

            console.log(this);

            this.isLoading = true;

           let index = this._uid;
           let value = parseInt(this.voteValue, 10);

            console.log(index, value);

           await this.callAEContract(
               'voteMeme',
               [index],
               value);

           this.meme.votes = parseInt(this.meme.votes, 10) + value;
           this.voteValue = null;

           this.isLoading = false;

       },
        async commentMeme (event) {

            this.isLoading = true;

            let index = this._uid;
            let comment = this.comment;
            let author = this.commentAuthor;

            await this.callAEContract(
                'commentMeme',
                [index, comment, author],
                0);

            this.meme.comments.push({
                "comment": comment,
                "author": author
            });

            this.isLoading = false;
        }
    },
    async created (){

        await this.getContractInstance();
    }
});

var memeComment = Vue.component('meme-comment', {
    props: {
        comment: Object
    },
    template: memeCommentTemplate
});

Vue.config.devtools = "development";

var app = new Vue({
    el: '#app',
    mixins: [aeternityMixin],
    data: {
        runningInFrame: window.parent !== window,
        isLoading: false,
        title: pageTitle,
        memes: memeArray,
        memeUrl: "",
        memeTags: "",
        userNickname: "",
    },
    head: {
        title: {
            inner: pageTitle,
            separator: ' ',
            complement: ' '
        }
    },
    methods: {
        async getReverseWindow() {
            const iframe = document.createElement('iframe')
            iframe.src = prompt('Enter wallet URL', 'http://127.0.0.1:8080')
            iframe.style.display = 'none'
            document.body.appendChild(iframe)
            await new Promise(resolve => {
                const handler = ({ data }) => {
                    if (data.method !== 'ready') return
                    window.removeEventListener('message', handler)
                    resolve()
                }
                window.addEventListener('message', handler)
            })
            return iframe.contentWindow
        },
        async getMemesLength () {

            return this.callAEStatic('getMemesLength', []);
        },
        async getMeme(index) {

            this.isLoading = true;

            const memeComments = await this.getMemeComments(index);

            this.isLoading = true;

            // The return type works for memes with no comments.
            // When a meme has comments the return type must be specified.
            return this.callAEStatic('getMeme',
                                     [index]);
        },
        async getMemeComments(index) {
            // this is used to get the comments length and set de correct
            // type of the static call to getMeme


            return this.callAEStatic('getMemeComments',
                                     [index]);
        },
        async registerMeme(){

            const url = this.memeUrl,
                  user = this.userNickname,
                  index = memeArray.length + 1,
                  tags = this.memeTags.split(","),
                  stringTags = tags.map( i=> `"${i}"`).join(',');

            await this.callAEContract(
                'registerMeme',
                [url, user, tags],
                0);

            memeArray.push({
                creatorName: user,
                memeUrl: url,
                index: index,
                votes: this.voteCount,
                comments: [],
                tags: tags
            });
        }
    },
    async created (){

        await this.getClient();
        await this.getContractInstance();
        console.log(this.client);

        const memesLength = await this.getMemesLength();

        for (let i = 1; i <= memesLength; i++ ) {
            const memeComments = await this.getMemeComments(i);
            const meme = await this.getMeme(i);

            let commentsLength = memeComments.length;

            let commentArray = [];
            if (commentsLength > 0) {
                for (let c = 0; c < commentsLength; c++) {

                    commentArray.push({
                        "comment" : memeComments[0].comment,
                        "author" : memeComments[0].author
                    });
                }
            }

            memeArray.push({
                creatorName: meme.name,
                memeUrl: meme.url,
                index: i,
                votes: meme.voteCount,
                comments: commentArray,
                tags: meme.tags
            });
        }
    },
    computed: {
        sortedMemes: function() {
            return this.memes.sort(function(a,b) {return b.votes-a.votes});
        }
    }
});
