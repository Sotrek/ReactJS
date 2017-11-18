class Comment extends React.Component {
  render() {
    return(
      <div className="comment">
        <p className="comment-header">
          {this.props.author}
        </p>
        <p className="comment-body">
          {this.props.body}
        </p>
        <div className="comment-actions">
          <a href="#">Delete comment</a>
        </div>
      </div>
    );
  }
}

class CommentBox extends React.Component {
  render() {
    const comments = this._getComment() || [];
    return(
      <div className="comment-box">
        <h3>Comments</h3>
        <h4 className="comment-count">{this._getCommentsTitle(comments.length)}</h4>
        <div className="comment-list">
            {comments}
        </div>
      </div>
    );
  }
  _getComment() {
    const commentList = [
      { id: 1, author: 'Clu', body: 'Just say no to love!', avatarUrl: 'images/default-avatar.png' },
      { id: 2, author: 'Anne Droid', body: 'I wanna know what love is...', avatarUrl: 'images/default-avatar.png' }
    ];    
    return commentList.map((comment)=> <Comment author={comment.author} body={comment.body} avatarUrl={comment.avatarUrl} key={comment.id}/>)
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
}

// Query(function() {
  ReactDOM.render(
    <CommentBox />,
    document.getElementById('comment-box')
  );
// })
