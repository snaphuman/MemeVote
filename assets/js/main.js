const contractAddress = 'ct_2MeJgny8DrDPeRyHPCuhZh4wrJwPVgKV9sEghRNVY33EfE63Sc ';

var memeArray = [];

var memesLength = 0;

var commentsArray = [];

var tagsArray = [];

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
        async getClient() {
            this.client = await Ae.Aepp();
        },
        async callAEStatic (func, args, types) {
            const calledGet = await this.client.contractCallStatic(
                contractAddress, 'sophia-address', func, {args})
                  .catch(e => console.error(e));

            const decodedGet = await this.client.contractDecodeData(types, calledGet.result.returnValue)
                  .catch(e => console.error(e));

            console.log(decodedGet);

            return decodedGet;
        },
        async getMemesLength () {

            return this.callAEStatic('getMemesLength', '()', 'int');
        },
        async getMeme(index) {

            // The return type works for memes with no comments.
            // When a meme has comments the return type must be specified.
            return this.callAEStatic('getMeme',
                                     `(${index})`,
                                     '(address, string, string, int, list(string), list(string))');
        }
    },
    async created (){

        await this.getClient();
        console.log(this.client);

        const memesLength = await this.getMemesLength();

        console.log(memesLength.value);

        for (let i = 1; i <= memesLength.value; i++ ) {
            const meme = await this.getMeme(i);

            memeArray.push({
                creatorName: meme.value[2].value,
                memeUrl: meme.value[1].value,
                index: i,
                votes: meme.value[3].value,
                comments: commentsArray,
                tags: meme.value[5].value
            });
        }

        console.log(memeArray);
    }
});
