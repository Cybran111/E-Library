from flask_wtf import Form
from wtforms import TextField
from wtforms.validators import DataRequired


class AuthorForm(Form):
    name = TextField('name', validators=[DataRequired()])
    # name = TextField('name')

