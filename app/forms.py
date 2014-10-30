from flask_wtf import Form
from wtforms import StringField
from wtforms.validators import DataRequired


class AuthorForm(Form):
    name = StringField('name', validators=[DataRequired()])
    # Maybe it will works in the future...
    # books = FieldList(StringField('books', validators=[DataRequired()]))


class BookForm(Form):
    title = StringField('title', validators=[DataRequired()])
