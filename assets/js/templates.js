var memeCardTemplate = `
  <div class="columns">
    <div class="column is-half is-offset-one-quarter">
      <div class="card">
          <header class="card-header">
            <div class="card-header-title">
            <h2 class="title is-2">{{ meme.creatorName}}</h2>
            </div>
            <div class="tags">
              <span class="tag is-danger"
              v-for="tag in meme.tags"
              >{{ tag.value }}</span>
          </header>
          <div class="card-image">
              <figure class="image is-2by1">
                  <img :src="meme.memeUrl" alt="Placeholder image">
              </figure>
          </div>
          <div class="card-content">
              <div class="content">
                  <div class="media is-vcentered">
                      <div class="media-left">
                          <span class="title is-6">ættos</span>
                          <div class="title is-1">{{ meme.votes }}</div>
                      </div>
                      <div class="media-content">
                          <div class="box">
                              <form class="has-text-centered">
                                  <div class="field has-addons has-addons-centered">
                                      <div class="control">
                                          <input class="input is-expanded" type="number" placeholder="add ættos for this meme">
                                      </div>
                                      <div class="control">
                                          <a class="button is-info">
                                              Vote
                                          </a>
                                      </div>
                                  </div>
                                  <div class="field has-addons has-addons-centered">
                                      <div class="control">
                                          <input class="input is-expanded" type="text" placeholder="comment this meme">
                                      </div>
                                      <div class="control">
                                          <a class="button is-info">
                                              Comment
                                          </a>
                                      </div>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
                  <div id="comments" v-if="comments">
                      <h3 class="title is-2">Comments</h3>
                      <meme-comment
                      v-for="comment in comments"
                      v-bind:comment="comment">
                      </meme-comment>
                      <footer class="card-footer">
                          <a href="#" class="card-footer-item">View all comments</a>
                      </footer>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
`;

var memeCommentTemplate = `
  <div class="comment">
      <div class="comment-author">
          <p class="title is-4">{{ comment.author }}</p>
      </div>
      <div class="comment-body">
        {{ comment.comment }}
      </div>
  </div>
`;
