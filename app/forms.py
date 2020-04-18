from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class TrainingSelection(FlaskForm):
    is_mozart = BooleanField('Mozart')
    is_bach = BooleanField('Bach')
    is_liszt = BooleanField('Liszt')
    is_schubert = BooleanField('Schubert')
    is_linkinpark = BooleanField('Linkin Park')
    submit = SubmitField('Generate Music')