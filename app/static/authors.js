/**
 * Created by cybran on 10/30/14.
 */

(function ($) {

    var Author = Backbone.Model.extend({
        urlRoot: '/authors'
    });

    var AuthorList = Backbone.Collection.extend({
        model: Author,
        url: 'authors'
    });

    var AuthorView = Backbone.View.extend({

        events: {
            'click button#update-author': 'update',
            'click button.delete': 'remove',
            'click button.edit': 'showEditName',
            'click button.books': 'showEditBooks',
            'click button#update-books': 'update'
        },

        template: _.template($("#author-view-template").html()),
        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove', 'update');
            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function () {
            template = this.template(this.model.toJSON());
            $(this.el).html(template);
            return this;
        },

        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
//            console.log(this.model);
            this.model.destroy();
        },

        update: function () {
            temp_name = $("input#author-name-input", this.el).val();
            temp_books = $("textarea#books-input", this.el).val().split("\n");
            this.model.set({
                name: (temp_name) ? temp_name : this.model.get("name"),
                books: (temp_books[0]) ? temp_books : this.model.get("books")
            });
            this.model.save();
        },

        showEditName: function () {
            if ($(".edit-author", this.el).css('display') == 'none') {

                $("#author-name", this.el).css('display', 'none');
                $("input#author-name-input", this.el).val(this.model.get('name'));
                $(".edit-author", this.el).css('display', 'block');


            } else {
                $("#author-name", this.el).css('display', 'block');
                $(".edit-author", this.el).css('display', 'none');
            }
        },

        showEditBooks: function () {
            if ($("div.edit-written-books", this.el).css('display') == 'none') {

                $("h6.written-books", this.el).css('display', 'none');
                $("textarea#books-input", this.el).val(this.model.get('books').join("\n"));
                $("div.edit-written-books", this.el).css('display', 'block');


            } else {
                $("h6.written-books", this.el).css('display', 'block');
                $("div.edit-written-books", this.el).css('display', 'none');
            }
        }

    });

    var AuthorListView = Backbone.View.extend({
        el: $('#authors'), // attaches `this.el` to an existing element.


        events: {
            'click button#submit': 'addAuthor',
            'click button#add-author': 'showNewAuthor'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addAuthor', 'appendAuthor'); // fixes loss of context for 'this' within methods

            this.collection = new AuthorList();
            this.collection.bind('add', this.appendAuthor); // collection event binder
            this.collection.fetch();
            this.render();
        },

        render: function () {
            _(this.collection.models).each(function (author) {
                this.appendBook(author)
            }, this)
        },

        addAuthor: function () {
            var author = new Author();
            author.set({
                name: $("input#new-author-name", this.el).val()
            });
            console.log(author.get("name"));
            this.collection.add(author);
            author.save()
        },

        appendAuthor: function (author) {

            var authorView = new AuthorView({
                model: author
            });
            $('#authors-list', this.el).append(authorView.render().el);
        },

        showNewAuthor: function () {
            if ($("div.create-author", this.el).css('display') == 'none') {

                $("div.create-author", this.el).css('display', 'block');


            } else if ($("div.create-author", this.el).css('display') == 'block') {
                $("div.create-author", this.el).css('display', 'none');
            }

        }
    });

    var authorListView = new AuthorListView();
})(jQuery);