from django import forms
from django.contrib.auth.models import User

class SignUpForm(forms.Form):
    first_name = forms.CharField(label='First Name', max_length=100)
    last_name = forms.CharField(label='Last Name', max_length=100)
    username = forms.CharField(label='Username', max_length=100)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

class LoginForm(forms.Form):
  username = forms.CharField(label='Username', max_length=100)
  password = forms.CharField(widget=forms.PasswordInput)
