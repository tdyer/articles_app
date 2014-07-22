// Pattern used to define a namespace
var Blog = Blog || {};

// Object literal because we only need one of these
Blog.ArticleList = {
  // Ajax callback handler
  articlesCallbackHandler: function(articles){
    // build the HTML to insert into the list of articles ul
    var articlesHTML = "",
    newArticle;

    // 3. Calculate the number of articles returned by the server in the success callback.    
    this.count = articles.length;

    // cycle thru all the articles sent back from server
    // building HTML
    articles.forEach(function(article){
      // Create an instance of Article
      // pass it an id, title and body
      newArticle = new Blog.Article(article.id, article.title, article.body);
      // get the article HTML
      articlesHTML += newArticle.showView();
    });

    // Inefficient, because it will look thru the DOM 
    // each time we need the article ul
    // $("#articles").empty();

    // empty the HTML articles ul
    this.articlesListElem.empty();
    // set the HTML articles ul
    this.articlesListElem.append(articlesHTML);
  },
  // button click handler
  getArticles: function(){
    //alert("Go off to the backend and get all the articles");

    this.count = 0;

    // fires off a HTTP GET to the backend
    $.ajax({
      url: 'http://localhost:3000/articles',
      // On the reply from the Rails API server
      // invoked the method articlesCallbackHandler
      //success: this.articlesCallbackHandler.bind(this)      
    })
    .done(this.articlesCallbackHandler.bind(this))
    .done(function(){
      // 2. Show the number of articles on the page.
      this.articleCountElem.html("<p> " + this.count + " Articles</p>");
    }.bind(this));

  },
  addArticleToList: function(article){
    var newArticle = new Blog.Article(article.id, article.title, article.body),
    articleHTML = newArticle.showView();
    this.articlesListElem.append(articleHTML); 
    this.count = this.count + 1;
  },
  createArticle: function(event){
    // New article form
    var $form = $(event.target),
      $title = $form.find("input[name='title']"),
      $body = $form.find("input[name='body']"),
      requestObj = {article:  {title: $title.val(), body: $body.val()}};

      $title.val("");
      $body.val("");

    event.preventDefault();
    // Create and send a POST request
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/articles', 
      data: requestObj,
      dataType: 'json'
    })
    .done(this.addArticleToList.bind(this))
    .done(function(){
      // 2. Show the number of articles on the page.
      this.articleCountElem.html("<p> " + this.count + " Articles</p>");
    }.bind(this));
  },
  init: function(getArticlesID, articlesListID, articleCountID){
    this.getArticlesButton = $(getArticlesID);
    this.articlesListElem = $(articlesListID);

    // create a reference to the div for article count
    this.articleCountElem = $(articleCountID);
    // 1. Create a global article and set it to 0
    this.count = 0;

    // Set up click handler for form submit
    $('#new-article').on('submit', this.createArticle.bind(this));

    // Set the click handler
    this.getArticlesButton.on('click', this.getArticles.bind(this));

    // Simulate a user click event. Will get all the articles
    this.getArticlesButton.trigger('click');
  }
};