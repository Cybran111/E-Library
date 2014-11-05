from flask import request
from flask.ext.restful import Resource
from werkzeug.utils import escape

from app.forms import AuthorForm
from app import db, authors_api
from app.models import Book, Author


class AuthorsListApi(Resource):
    def get(self):
        Authors = Author.query.all()
        authors_and_books = [{'id': author.author_id,
                              'name': author.name,
                              "books": [book.title for book in author.books]
                             }
                             for author in Authors]
        return authors_and_books

    def post(self):
        """
        Adding new author
        :return: Response
        """
        form = AuthorForm()
        if form.validate_on_submit():
            author = Author(escape(form.data["name"]))
            db.session.add(author)
            db.session.commit()


authors_api.add_resource(AuthorsListApi, "")


class AuthorApi(Resource):
    def put(self, author_id):
        """
        Update author's info
        :param author_id: author's id for getting from DB
        :return: Response
        """
        form = AuthorForm()
        if form.validate_on_submit():
            author = Author.query.get(author_id)
            author.name = escape(form.data['name'])

            # escape() is overkill here
            books = [Book.query.filter_by(title=escape(submitted_book_title)).first()
                     for submitted_book_title in request.json["books"]
            ]
            # remove all nonexistent objects (they are not in DB)
            books = list(filter(None, books))
            author.books = books
            db.session.commit()

    def delete(self, author_id):
        """
        Delete author
        :param author_id: author's id
        :return: Response
        """
        author = Author.query.get(author_id)
        db.session.delete(author)
        db.session.commit()


authors_api.add_resource(AuthorApi, '/<int:author_id>')


class SearchAuthorApi(Resource):
    def get(self, author_name):
        """
        Search author in DB
        :param author_name: for search by name
        :return: JSON response
        """
        author = Author.query.filter_by(name=author_name).first_or_404()
        author_and_books = {'id': author.author_id,
                            'name': author.name,
                            "books": [book.title for book in author.books]
        }
        return author_and_books


authors_api.add_resource(SearchAuthorApi, '/<string:author_name>')


class SearchAuthorsByBookApi(Resource):
    def get(self, book_title):
        book = Book.query.filter_by(title=book_title).first_or_404()
        authors = [
            {
                "id": author.author_id,
                "name": author.name,
                "books": [book.title for book in author.books]
            } for author in book.authors
        ]

        return authors


authors_api.add_resource(SearchAuthorsByBookApi, '/by_book/<string:book_title>')