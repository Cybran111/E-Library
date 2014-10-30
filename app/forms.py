from flask_wtf import Form
from wtforms import TextField
from wtforms.validators import DataRequired


class AuthorForm(Form):
    name = TextField('name', validators=[DataRequired()])


class BookForm(Form):
    title = TextField('title', validators=[DataRequired()])
