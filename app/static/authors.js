/**
 * Created by cybran on 10/30/14.
 */
var Author = Backbone.Model.extend({
    urlRoot: '/authors'
});

var AuthorList = Backbone.Collection.extend({
    model: Author,
    url: 'authors'
});

var AuthorView = Backbone.View.extend({

    tagName: "div",
    className: "list-group-item",

    events: {
        'click button.delete': 'remove',
        'click button.edit': 'showEditName',
        'click button.books': 'showEditBooks',
        'click button#update-books': 'update',
        'click button#update-author': 'update'
    },

    template: _.template($("#author-view-template").html()),

    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'remove', 'update', 'active');
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
    active: function () {
        if ($(this.el).hasClass("active")) {
            $(this.el).removeClass("active")
        } else {
            $(this.el).addClass("active")
        }
    },

    remove: function () {
        this.model.destroy();
    },

    update: function () {
        temp_name = $("input#author-name-input", this.el).val();
        temp_books = $("textarea#books-input", this.el).val().split("\n");
        this.model.set({
            name: (temp_name) ? temp_name : this.model.get("name"),
            books: temp_books
        });
        this.model.save();
    },

    showEditName: function () {

        if ($(".edit-author", this.el).is(':hidden')) {
            $("#author-name", this.el).hide();
            $("input#author-name-input", this.el).val(this.model.get('name'));
            $(".edit-author", this.el).show();
        } else {
            $("#author-name", this.el).show();
            $(".edit-author", this.el).hide();
        }
    },

    showEditBooks: function () {

        if ($("div.edit-written-books", this.el).is(':hidden')) {

            $("h6.written-books", this.el).hide();
            $("textarea#books-input", this.el).val(this.model.get('books').join("\n"));
            $("div.edit-written-books", this.el).show();


        } else {
            $("h6.written-books", this.el).show();
            $("div.edit-written-books", this.el).hide();
        }
    }

});

var AuthorListView = Backbone.View.extend({
    el: $('#authors'), // attaches `this.el` to an existing element.

    events: {
        'change input.search-author': 'changeSearchQuery',
        'click button#submit': 'addAuthor',
        'click button#add-author': 'showNewAuthor'
    },

    changeSearchQuery: function () {
        search_query = $('input.search-author').val();
        $("a.search-author").attr("href", "#/search/author/" + search_query)
    },

    initialize: function (books) {
        _.bindAll(this, 'render', 'addAuthor', 'appendAuthor'); // fixes loss of context for 'this' within methods
        this.books = books.collection;

        this.childs = [];
        this.collection.bind('add', this.appendAuthor); // collection event binder
        this.collection.bind('reset', this.render);
    },

    render: function () {
        this.childs.forEach(function (child) {
            child.remove();
        });
        this.childs = [];

        _(this.collection.models).each(function (author) {
            this.appendAuthor(author)
        }, this)
    },


    addAuthor: function () {
        var author = new Author();
        author.set({
            name: $("input#new-author-name", this.el).val()
        });
        this.collection.add(author);
        author.save()
    },

    appendAuthor: function (author) {

        var authorView = new AuthorView({
            model: author
        });
        this.childs.push(authorView);
        $('#authors-list').append(authorView.render().el);
    },

    showNewAuthor: function () {
        if ($("div.create-author", this.el).css('display') == 'none') {

            $("div.create-author", this.el).css('display', 'block');


        } else if ($("div.create-author", this.el).css('display') == 'block') {
            $("div.create-author", this.el).css('display', 'none');
        }

    }
});