from flask import request
from flask.ext.restful import Resource
from werkzeug.utils import escape

from app.forms import BookForm
from app import db, books_api
from app.models import Book, Author


class BooksListApi(Resource):
    def get(self):
        books = Book.query.all()
        books_and_authors = [{'id': book.book_id,
                              'title': book.title,
                              'authors': [author.name for author in book.authors]}
                             for book in books]

        return books_and_authors

    def post(self):
        """
        Adding new book
        :return: Response
        """
        form = BookForm()
        if form.validate_on_submit():
            author = Author(escape(form.data["name"]))
            db.session.add(author)
            db.session.commit()


books_api.add_resource(BooksListApi, "")


class BookApi(Resource):
    def put(self, book_id):
        form = BookForm()
        if form.validate_on_submit():
            book = Book.query.get(book_id)
            book.title = escape(form.data['title'])

            # escape() is overkill here
            authors = [Author.query.filter_by(name=escape(submitted_artist_name)).first()
                       for submitted_artist_name in request.json["authors"]
            ]
            # remove all nonexistent objects (they are not in DB)
            authors = list(filter(None, authors))
            # FIXME: Old M2M relations is not removed. Refactoring needed
            book.authors = authors

            db.session.commit()

    def delete(self, book_id):
        """
        Delete book
        :param book_id: book's id
        :return: Response
        """
        book = Book.query.get(book_id)
        db.session.delete(book)
        db.session.commit()


books_api.add_resource(BookApi, '/<int:book_id>')


class SearchBooksByAuthorApi(Resource):
    def get(self, author_name):
        author = Author.query.filter_by(name=author_name).first_or_404()
        books = [
            {
                "id": book.book_id,
                "title": book.title,
                "authors": [author.name for author in book.authors]
            } for book in author.books
        ]

        return books


books_api.add_resource(SearchBooksByAuthorApi, '/by_author/<string:author_name>')


class SearchBookApi(Resource):
    def get(self, book_title):
        book = Book.query.filter_by(title=book_title).first_or_404()
        book_and_authors = {'id': book.book_id,
                            'title': book.title,
                            'authors': [author.name for author in book.authors]
        }

        return book_and_authors


books_api.add_resource(SearchBookApi, '/<string:book_title>')
