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
              >{{ tag.value || tag }}</span>
          </header>
          <div class="card-image">
              <figure class="image is-1">
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
                                          <input class="input is-expanded" type="number" placeholder="add ættos for this meme" v-model="voteValue">
                                      </div>
                                      <div class="control">
                                          <a class="button is-info" v-on:click="voteMeme($event)">
                                              Vote
                                          </a>
                                      </div>
                                  </div>
                                  <div class="field is-horizontal">
                                      <div class="field-label">
                                          <label class="label">Comment</label>
                                      </div>
                                      <div class="field-body">
                                        <div class="field">
                                          <div class="control is-expanded">
                                            <input class="input" type="text" placeholder="Your name" v-model="commentAuthor">
                                          </div>
                                        </div>
                                        <div class="field">
                                          <div class="control is-expanded">
                                              <input class="input" type="text" placeholder="comment this meme" v-model="comment">
                                          </div>
                                        </div>
                                     </div>
                                     </div>

                                     <div class="field is-horizontal">
                                        <div class="field-label">
                                          <!-- Left empty for spacing -->
                                        </div>
                                        <div class="field-body">
                                          <div class="field">
                                            <div class="control">
                                              <a class="button is-primary" v-on:click="commentMeme($event)">
                                                Comment
                                              </a>
                                            </div>
                                          </div>
                                        </div>
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
