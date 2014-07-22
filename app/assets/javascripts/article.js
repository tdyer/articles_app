var Blog = Blog || {};

// Article Constructor Function                                                 
Blog.Article = function(id, title, body){
  this.id = id;
  this.title = title;
  this.body = body;
};

// method to generate HTML for one article                                      
Blog.Article.prototype = {
  showView: function(){
    var articleHTML = '<li id=article_' + this.id + '>' + this.title;
    articleHTML += '<div>' + this.body + '</div>';
    articleHTML += '</li>';

    return articleHTML;
  }
};