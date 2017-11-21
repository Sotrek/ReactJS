class CommentBox extends React.Component {
  constructor(){
    super();

    this.state = {
      showComments: true,
      comments: []

    };
  }
  componentWillMount(){
    this._fetchComments();
  }
  render() {
    const comments = this._getComment() || [];
    let commentNodes;
    if( this.state.showComments ){
      commentNodes = <div className="comment-list">{comments}</div>
    }
    return(
      <div className="comment-box">
        <CommentForm addComment={this._addComment.bind(this)}/>
        <CommentAvatarList avatars={this._getAvatars()} />
        <h3>Comments</h3>
         {this._getPopularMessage(comments.length)}
        <h4 className="comment-count">{this._getCommentsTitle(comments.length)}</h4>
        <button onClick={this._handleClick.bind(this)}>Show Comments</button>
        {commentNodes}
        {console.log(commentNodes)}
      </div>
    );
  }
  componentDidMount(){
    this._timer = setInterval(() => this._fetchComments(), 5000);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  _handleClick(){
    this.setState({
      showComments: !this.state.showComments
    });

  }
  _getComment() {
    // const commentList = [
    //   { id: 1, author: 'Clu', body: 'Just say no to love!', avatarUrl: 'assets/images/avatars/avatar-default.png' },
    //   { id: 2, author: 'Anne Droid', body: 'I wanna know what love is...', avatarUrl: 'assets/images/avatars/avatar-default.png' }
    // ];    
    return this.state.comments.map((comment)=> <Comment author={comment.author} body={comment.body} avatarUrl={comment.avatarUrl} key={comment.id}/>)
  }
  _getCommentsTitle(commentsCount){
      if(commentsCount === 0){
        return 'No comments yet';
      } else if (commentsCount === 1) {
        return '1 comment';
      } else {
        return `${commentsCount} comments`;
      }
  }
  _getAvatars() {
    return this.state.comments.map((comment) => {
      return comment.avatarUrl;
    });
  }
  _getPopularMessage(commentCount) {
    const POPULAR_COUNT = 10;
    
    if(commentCount > POPULAR_COUNT){
      return(<div>
              This post is getting really popular, don't miss out!
        </div>);
    }
    
  }
  _addComment(author, body) {
    const comment = {
      id: this.state.comments.length + 1,
      author,
      body
    }; 
    this.setState({ comments: this.state.comments.concat([comment])});
  }
  _fetchComments(){
    $.ajax({
      method: 'GET',
      url: '/api/comments',
      success: (comments) => {
        this.setState({comments})
      }
    });
  }
  _deleteComment(comment) {
    $.ajax({
     method: "DELETE",
     url:`api/comments/${comment.id}`
    });

    const comments = [...this.state.comments];
    const commentIndex = comments.indexOf(comment);
    comments.splice(commentIndex,1);

    this.setState({comment});

    return this.state.comments.map( comment => {
      return (
            <Comment key={comment.id} comment={comment} onDelete={this._deleteComment.bind(this)} />
        );
    })
  }
}

class Comment extends React.Component {
  constructor(){
    super();

    this.state = {
      isAbusive: false
    };
  }
  render() {

    let commentBody;
    if (this.state.isAbusive == false){
      commentBody = this.props.body;
    } else {
      commentBody = <em>Content marked as abusive</em>;
    }

    return(
      <div className="comment">
        <img className="comment" src={this.props.avatarUrl} alt={`${this.props.author}'s picture`}/>
        <p className="comment-header">
          {this.props.author}
        </p>
        <p className="comment-body">
          {commentBody}
        </p>
        <div className="comment-actions">
          <a href="#" onClick={this._handleDelete.bind(this)}>Delete comment</a>
          <a href="#" onClick={this._toggleAbuse.bind(this)}>Report as Abuse</a>
        </div>
      </div>
    );
  }
  _toggleAbuse(event){
    event.preventDefault();
    this.setState({isAbusive: !this.state.isAbusive});
  }
  _handleDelete(event){
    event.preventDefault();
     if(confirm("Are you sure?")){
      this.props.onDelete(this.props.id);
    }
  }
}

class CommentForm extends React.Component {
  constructor(){
    super();
    this.state = {
      characters: 0
    }
  }
  render(){
    return(
      <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
        <label>Join the discussion</label>
        <div className="comment-form-fields">
          <input placeholder="Name" ref={(input) => this._author = input}/>
          <textarea placeholder="Comment" 
            ref={(textarea) => this._body = textarea}
            onKeyUp={this._getCharacterCount.bind(this)}
          ></textarea>
          <p>{this.state.characters} characters</p>
        </div>
        <div className="comment-form-actions">
          <button type="submit">
            Post comment
          </button>
        </div>
      </form>
    );
  }
  _handleSubmit(event){
    event.preventDefault;

    if(!this._author.value || !this._body.value){
     alert("Please enter your name and comment")
     return;
    }

    let author = this._author;
    let body = this._body;

    this.props.addComment(author.value, body.value);
  }
  _getCharacterCount(){
    this.setState({characters: this._body.value.length})
  }
}
class CommentAvatarList extends React.Component {
  render() {
    const { avatars = [] } = this.props;
    return (
      <div className="comment-avatars">
        <h4>Authors</h4>
        <ul>
          {avatars.map((avatarUrl, i) => (
            <li key={i}>
              <img src={avatarUrl} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// Query(function() {
  ReactDOM.render(
    <CommentBox />,
    document.getElementById('comment-box')
  );
// })