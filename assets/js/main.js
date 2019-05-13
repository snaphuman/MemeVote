var memeArray = [];

var memesLength = 0;

var commentArray = [];

var pageTitle = "Meme Voting";

var memeCard = Vue.component('meme-card', {
    props: {
        meme: Object,
        client: Object
    },
    data: function(){
        return {
            client: null,
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

            let index = this._uid - 1;
            let value = this.voteValue;

            console.log(index, value);

           await operations.onCallDataAndFunctionAsync(
               this.client,
               'voteMeme',
               `(${index})`,
               {'amount':value},
               '(int)');

           this.meme.votes += parseInt(value, 10);

           this.isLoading = false;

       },
        async commentMeme (event) {

            this.isLoading = true;

            let index = this._uid;
            let comment = this.comment;
            let author = this.commentAuthor;

            await operations.onCallDataAndFunctionAsync(
                this.client,
                'commentMeme',
                `(${index},"${comment}","${author}")`,
                {},
                '(int)');

            this.meme.comments.push({
                "comment": comment,
                "author": author
            });
            
            this.isLoading = false;
        }
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
    data: {
        isLoading: false,
        title: pageTitle,
        memes: memeArray,
        memeUrl: "",
        memeTags: "",
        userNickname: "",
        client: null,
        contractInstance: null,
        callOpts: {
            deposit: 0,
            gasPrice: 1000000000,
            amount: 0,
            fee: null, // sdk will automatically select this
            gas: 1000000,
            callData: '',
            verify: true
        }
    },
    head: {
        title: {
            inner: pageTitle,
            separator: ' ',
            complement: ' '
        }
    },
    methods: {
        async getClient() {

            this.isLoading = true;

            this.client = await Ae.Aepp();

            console.log(source);

            this.contractInstance = await this.client.getContractInstance(source, { contractAddress: settings.contractAddress });
            console.log(this.contractInstance);

            this.isLoading = false;
        },
        async callAEStatic(func, args, types) {
            if (func && args) {
                try {
                    const res = await this.contractInstance.call(func, args);
                    return res.decode();
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('Please enter a Function and 1 or more Arguments.');
            }
        },
        async getMemesLength () {

            return this.callAEStatic('getMemesLength', `()`);
        },
        async getMeme(index) {

            this.isLoading = true;
            const memeComments = await this.getMemeComments(index);
            let type;

            if (memeComments.value.length) {
                type = '(address, string, string, int, list((address,string,string)), list(string))';
            } else {
                type = '(address, string, string, int, list(string), list(string))';
            }

            console.log(type);

            this.isLoading = true;

            // The return type works for memes with no comments.
            // When a meme has comments the return type must be specified.
            return this.callAEStatic('getMeme',
                                     [],
                                     `(${type})`);
        },
        async getMemeComments(index) {
            // this is used to get the comments length and set de correct
            // type of the static call to getMeme


            return this.callAEStatic('getMemeComments',
                                     `(${index})`,
                                     '(list((address,string,string)))'
                                    );
        },
        async registerMeme(){

            const url = this.memeUrl,
                  user = this.userNickname,
                  index = memeArray.length + 1,
                  tags = this.memeTags.split(","),
                  stringTags = tags.map( i=> `"${i}"`).join(',');

            await operations.onCallDataAndFunctionAsync(
                this.contractInstance,
                'registerMeme',
                [url, user, tags],
                'int');

            memeArray.push({
                creatorName: user,
                memeUrl: url,
                index: index,
                votes: 0,
                comments: [],
                tags: tags
            });
        }
    },
    async created (){

        await this.getClient();
        console.log(this.client);

        const memesLength = await this.getMemesLength();
        console.log(memesLength.value);

        for (let i = 1; i <= memesLength.value; i++ ) {
            const memeComments = await this.getMemeComments(i);
            const meme = await this.getMeme(i);

            let commentsLength = memeComments.value.length;

            commentArray = [];
            if (commentsLength > 0) {
                for (let c = 0; c < commentsLength; c++) {

                    console.log(memeComments.value[c]);
                    commentArray.push({
                        "comment" : memeComments.value[c].value[2].value,
                        "author" : memeComments.value[c].value[1].value
                    });
                }
            }

            memeArray.push({
                creatorName: meme.value[2].value,
                memeUrl: meme.value[1].value,
                index: i,
                votes: meme.value[3].value,
                comments: commentArray,
                tags: meme.value[5].value
            });
        }

        console.log(memeArray);
    },
    computed: {
        sortedMemes: function() {
            return this.memes.sort(function(a,b) {return b.votes-a.votes});
        }
    }
});
