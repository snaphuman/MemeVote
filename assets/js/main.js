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
        async getClient() {
            //this.client = await Ae.Aepp();
            this.client = await Ae.Wallet({
                url: settings.url,
                internalUrl: settings.internalUrl,
                account: [Ae.MemoryAccount({
                    keypair: {
                        secretKey: settings.account.priv,
                        publicKey: settings.account.pub
                    }
                })],
                address: settings.account.pub,
                onTx: true,
                onChain: true,
                onAccount: true,
                onContract: true,
                networkId: settings.networkId
            });
        },
        async callAEStatic (func, args, types) {
            const calledGet = await this.client.contractCallStatic(
                settings.contractAddress, 'sophia-address', func, {args})
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

            const memeComments = await this.getMemeComments(index);

            const memeComentsLength = Object.keys(memeComments).length;

            if (memeCommentsLength) {
                const type = '(address, string, string, int, list(string), list(string))';
            } else {
                const type = '(address, string, string, int, list((addres,string,string)), list(string))';
            }
            console.log("type:", type)

            // The return type works for memes with no comments.
            // When a meme has comments the return type must be specified.
            return this.callAEStatic('getMeme',
                                     `(${index})`,
                                     `(${type})`);
        },
        async getMemeComments(index) {
            // this is used to get the comments length and set de correct
            // type of the static call to getMeme


            return this.callAEStatic('getMemeComments',
                                     `(${index})`,
                                     '(list((address,string,string)))'
                                    );
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
