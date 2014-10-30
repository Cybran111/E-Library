/**
 * Created by cybran on 10/30/14.
 */

(function ($) {

    var Book = Backbone.Model.extend({
        urlRoot: '/books'
    });

    var BookList = Backbone.Collection.extend({
        model: Book,
        url: 'books'
    });

    var BookView = Backbone.View.extend({

        events: {
            'click button#update-book': 'update',
            'click button.delete': 'remove',
            'click button.edit': 'enterEdit'
        },

        template: _.template($("#book-view-template").html()),
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

            this.model.set({
                name: $("input#book-name-input", this.el).val()
            });
            this.model.save();
        },

        enterEdit: function () {
            if ($(".edit-book", this.el).css('display') == 'none') {

                $("#book-title", this.el).css('display', 'none');
                $("input#book-title-input", this.el).val(this.model.get('name'));
                $(".edit-book", this.el).css('display', 'block');

            } else {
                $("#book-title", this.el).css('display', 'block');
                $(".edit-book", this.el).css('display', 'none');
            }
        }

    });

    var BookListView = Backbone.View.extend({
        el: $('#books'), // attaches `this.el` to an existing element.


        events: {
            'click button#submit': 'addBook',
            'click button#add-book': 'showNewBook'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'addBook', 'appendBook'); // fixes loss of context for 'this' within methods

            this.collection = new BookList();
            this.collection.bind('add', this.appendBook); // collection event binder
            this.collection.fetch();
            this.render();
        },

        render: function () {
            _(this.collection.models).each(function (book) {
                this.appendBook(book)
            }, this)
        },

        addBook: function () {
            var book = new Book();
            book.set({
                name: $("input#new-book-name", this.el).val()
            });
            console.log(book.get("name"));
            this.collection.add(book);
            book.save()
        },

        appendBook: function (book) {

            var bookView = new BookView({
                model: book
            });
            $('#books-list', this.el).append(bookView.render().el);
        },

        showNewBook: function () {
            var new_author_block = "div.create-author";
            if ($(new_author_block, this.el).css('display') == 'none') {
                $(new_author_block, this.el).css('display', 'block');


            } else {
                $(new_author_block, this.el).css('display', 'none');
            }

        }
    });

    var bookListView = new BookListView();
})(jQuery);