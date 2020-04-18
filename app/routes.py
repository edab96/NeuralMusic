from flask import render_template, flash, redirect
from app import app
from app.forms import LoginForm, TrainingSelection

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Miguel'}
    posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('index.html')

@app.route('/model', methods=['GET', 'POST'])
def model():
    form = TrainingSelection()
    if form.validate_on_submit():
        file1 = open("inputs.txt", "a")
        file1.write(str(form.is_bach.data) + "\n")
        file1.close()
        return redirect('/index')
    return render_template('model.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        file1 = open("inputs.txt", "a")
        file1.write(form.username.data + "\n")
        file1.close()
        return redirect('/index')
    return render_template('login.html', title='Sign In', form=form)