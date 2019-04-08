var memeCardTemplate = `
  <div class="card">
      <div class="card-image">
          <figure class="image is-2by1">
              <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
          </figure>
      </div>
      <div class="card-content">
          <div class="content">
              <div class="media is-vcentered">
                  <div class="media-left">
                      <p class="title is-6">ættos</p>
                      <p class="title is-1">10</p>
                  </div>
                  <div class="media-content">
                      <div class="box">
                          <form class="has-text-centered">
                              <div class="field has-addons has-addons-centered">
                                  <div class="control">
                                      <input class="input is-expanded" type="number" placeholder="add ættos <f></f>or this meme">
                                  </div>
                                  <div class="control">
                                      <a class="button is-info">
                                          Vote
                                      </a>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
              <div id="comments">
                  <h2 class="title is-2">Comments</h2>
                  <meme-comment></meme-comment>
                  <footer class="card-footer">
                      <a href="#" class="card-footer-item">View all comments</a>
                  </footer>
              </div>
          </div>
      </div>
  </div>
`;

var memeCommentTemplate = `
  <div class="comment">
      <div class="comment-author">
          <p class="title is-4">Last comment</p>
      </div>
      <div class="comment-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Phasellus nec iaculis mauris.
      </div>
  </div>
`;
