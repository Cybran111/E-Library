/**
 * Created by cybran on 10/28/14.
 */

(function () {

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", $('meta[name=csrf-token]').attr('content'))
            }
        }
    });


    var AppRouter = Backbone.Router.extend({

        initialize: function () {
            this.authorList = new AuthorList();
            this.bookList = new BookList();

            this.bookListView = new BookListView({ collection: this.bookList });
            this.authorListView = new AuthorListView({ collection: this.authorList }
            );

            this.on("route:getAuthor", function (author_name) {
                this.switchAuthor(author_name);
            });

            this.on("route:getBook", function (book_title) {
                this.switchBook(book_title);
            });

//            this.on("route:defaultRoute", function () {
//                console.log("fdfs");
//                location.reload();
//            });


        },

        routes: {
            "authors/:author_name": "getAuthor",
            "books/:book_title": "getBook",
            "search/author/:search_query": "getAuthor",
            "search/book/:search_query": "getBook"
//            "": "defaultRoute" // Backbone will try match the route above first
        },

        switchAuthor: function (author_name) {
            this.authorList.url = 'authors/' + author_name;
            this.authorList.fetch();

            this.bookList.url = 'books/by_author/' + author_name;
            this.bookList.fetch();
        },

        switchBook: function (book_title) {
            this.authorList.url = 'authors/by_book/' + book_title;
            this.authorList.fetch();

            this.bookList.url = 'books/' + book_title;
            this.bookList.fetch();
        }

    });
    var app_router = new AppRouter;


    Backbone.history.start();

})(jQuery);