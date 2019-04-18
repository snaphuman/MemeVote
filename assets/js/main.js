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

            this.client = await Ae.Universal({
                url: settings.url,
                internalUrl: settings.internalUrl,
                keypair: {
                    secretKey: settings.account.priv,
                    publicKey: settings.account.pub
                },
                nativeMode: true,
                networkId: settings.networkId
            });

            this.isLoading = false;
        },
        async callAEStatic (func, args, types) {
            this.isLoading = true;
            const calledGet = await this.client.contractCallStatic(
                settings.contractAddress, 'sophia-address', func, {args})
                  .catch(e => console.error(e));

            const decodedGet = await this.client.contractDecodeData(types, calledGet.result.returnValue)
                  .catch(e => console.error(e));

            console.log(decodedGet);

            this.isLoading = false;
            return decodedGet;
        },
        async getMemesLength () {

            return this.callAEStatic('getMemesLength', '()', 'int');
        },
        async getMeme(index) {

            this.isLoading = true;
            const memeComments = await this.getMemeComments(index);
            let type;

            if (memeComments.value.length) {
                type = '(address, string, string, int, list((addres,string,string)), list(string))';
            } else {
                type = '(address, string, string, int, list(string), list(string))';
            }

            console.log(type);

            this.isLoading = true;

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
        },
        async onCallDataAndFunctionAsync(func, args, types) {
            const extraOpts = {
                'owner': settings.account.pub
            };

            const opts = Object.assign(extraOpts, this.callOpts);
            if (func && args && types) {
                try {
                    const dataRes = await this.contractAECall(func, args, opts);
                    if (types !== '()') {
                        const data = await this.client.contractDecodeData(types, dataRes.result.returnValue);
                        console.log(data);
                        return data;
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('Please enter a Function and 1 or more Arguments.');
            }
        },
        contractAECall(func, args, options) {

            console.log(`calling a function on a deployed contract with func: ${func}, args: ${args} and options:`, options);
            return this.client.contractCall(settings.contractAddress,
                                            'sophia-address',
                                            settings.contractAddress,
                                            func,
                                            { args, options });

        },
        async registerMeme(){

            const url = this.memeUrl,
                  user = this.userNickname,
                  index = memeArray.length + 1,
                  tags = this.memeTags.split(",");

            await this.onCallDataAndFunctionAsync('registerMeme',
                                                  `("${url}","${user}",["test"])`,
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
