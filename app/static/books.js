/**
 * Created by cybran on 10/30/14.
 */

var Book = Backbone.Model.extend({
    urlRoot: '/books'
});

var BookList = Backbone.Collection.extend({
    model: Book,
    url: 'books'
});

var BookView = Backbone.View.extend({

    tagName: "div",
    className: "list-group-item",

    events: {
        'click button#update-book': 'update',
        'click button.delete': 'remove',
        'click button.edit': 'showEditName',
        'click button.authors': 'showEditAuthors',
        'click button#update-authors': 'update'
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
        this.model.destroy();
    },

    update: function () {
        temp_title = $("input#book-title-input", this.el).val();
        temp_authors = $("textarea#authors-input", this.el).val().split("\n");
        this.model.set({
            title: (temp_title) ? temp_title : this.model.get("title"),
            authors: (temp_authors[0]) ? temp_authors : this.model.get("authors")
        });
        this.model.save();
    },

    showEditName: function () {
        if ($(".edit-book", this.el).css('display') == 'none') {

            $("#book-title", this.el).css('display', 'none');
            $("input#book-title-input", this.el).val(this.model.get('name'));
            $(".edit-book", this.el).css('display', 'block');

        } else {
            $("#book-title", this.el).css('display', 'block');
            $(".edit-book", this.el).css('display', 'none');
        }
    },

    showEditAuthors: function () {
        if ($("div.edit-authors", this.el).css('display') == 'none') {

            $("h6.authors", this.el).css('display', 'none');
            $("textarea#authors-input", this.el).val(this.model.get('authors').join("\n"));
            $("div.edit-authors", this.el).css('display', 'block');


        } else {
            $("h6.authors", this.el).css('display', 'block');
            $("div.edit-authors", this.el).css('display', 'none');
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

        this.childs = [];
        this.collection.bind('add', this.appendBook); // collection event binder
        this.collection.bind('reset', this.render);
        this.collection.fetch();
        this.render();
    },

    render: function () {
        this.childs.forEach(function (child) {
            child.remove();
        });
        this.childs = [];

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
        if ($("div.create-book", this.el).css('display') == 'none') {
            $("div.create-book", this.el).css('display', 'block');


        } else {
            $("div.create-book", this.el).css('display', 'none');
        }

    }
});