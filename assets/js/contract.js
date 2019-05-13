var source = 
    `
        contract MemeVote =

          record meme  =
            { creatorAddress : address,
              url            : string,
              name           : string,
              voteCount      : int,
              comments       : list(comment),
              tags           : list(string)}

          record comment =
            { authorAddress : address,
              author        : string,
              comment       : string}

          record state = {
            memes       : map(int, meme),
            memesLength : int}

          function init() = {
            memes = {},
            memesLength = 0}

          public function getMeme(index: int) : meme =
            switch(Map.lookup(index, state.memes))
              None    => abort("No meme was found.")
              Some(x) =>  x

          public stateful function registerMeme(url' : string, name' : string, tags' : list(string)) =
            let meme = { creatorAddress = Call.caller, url = url', name = name', voteCount = 0, comments = [], tags = tags'}
            let index = getMemesLength() + 1
            put(state {memes[index] = meme, memesLength = index})

          public function getMemesLength() : int =
            state.memesLength

          public stateful function voteMeme(index: int) =
            let meme = getMeme(index)
            Chain.spend(meme.creatorAddress, Call.value)
            let updatedVoteCount = meme.voteCount + Call.value
            let updatedMemes = state.memes{ [index].voteCount = updatedVoteCount }
            put(state {memes = updatedMemes})

          public stateful function commentMeme(index: int, comment': string, author': string) =
            let meme = getMeme(index)
            let comments = meme.comments
            let comment = {authorAddress = Call.caller, author = author', comment = comment'}
            let updatedComment =  comment::comments
            let updatedMemes = state.memes{ [index].comments = updatedComment }
            put(state {memes = updatedMemes})

          // Return type: (list((address,string,string)))
          public function getMemeComments(index: int) =
            let meme = getMeme(index)
            meme.comments
    `;

var contract = {
    source: source
};
