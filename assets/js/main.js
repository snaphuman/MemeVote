const contractAddress = 'ct_2npyeQ9r1ies2R51JLuEnNWk1FKsykqta8joVgrgSzo3PgThfA';

var memeArray = [];

var memesLength = 0;

var commentsArray = [];

var pageTitle = "Meme Voting";

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
});

var app = new Vue({
    el: '#app',
    data: {
        title: pageTitle,
        memes: memeArray,
        client: null
    },
    head: {
        title: {
            inner: pageTitle,
            separator: ' ',
            complement: ' '
        }
    },
    methods: {
        async callAEStatic (func, args, types) {
            const calledGet = await this.client.contractCallStatic(
                contractAddress, 'sophia-address', func, {args})
                  .catch(e => console.error(e));

            const decodedGet = await this.client.contractDecodeData(types, calledGet.result.returnValue)
                  .catch(e => console.error(e));

            return decodedGet.value;
        },
        getMemesLength () {

            return this.callAEStatic('getMemesLength', '()', 'int');
        },
        getMeme(index) {

            return this.callAEStatic('getMeme',
                                     `(${index})`,
                                     '(address, string, string, int, list(address,string,string), list(string))');
        }
    },
    created: async function(){

        this.client = await Ae.Aepp();
        console.log(client);

        const memesLength = this.getMemesLength();

        console.log(memesLength);

        for (let i = 1; i < memesLength; i++ ) {
            const meme = this.getMeme(i);

            memeArray.push({
                creatorName: meme.value[2].value,
                memeUrl: meme.value[1].value,
                index: i,
                votes: meme.value[3].value,
                comments: commentsArray,
                tags: meme.value[5]
            });
        }
    },
});
