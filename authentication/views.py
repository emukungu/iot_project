from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views import View
from django.urls import reverse
from django.contrib.auth.models import User

from .forms import SignUpForm, LoginForm
 # Create your views here.

class SignUp(View):
  def get(self, request):
    form = SignUpForm()
    return render(request, 'authentication/signup.html', {'form': form})

  def post(self, request):
    form = SignUpForm(request.POST)
    if form.is_valid():
        first_name = form.cleaned_data.get('first_name')
        last_name = form.cleaned_data.get('last_name')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')  
        email = form.cleaned_data.get('email')

        db_user = User.objects.create_user(username=username,
        password=password, first_name=first_name, last_name=last_name, email=email)
        user = authenticate(username=username, password=password)
        login(request, user)
        return redirect('/iot/')
    return render(request, 'authentication/signup.html', {'form': form}, status=400)


class Login(View):
  def get(self, request):
    form = LoginForm()
    return render(request, 'authentication/login.html', {'form': form})

  def post(self, request):
    form = LoginForm(request.POST)

    if form.is_valid():
      username = form.cleaned_data.get('username')
      email = form.cleaned_data.get('email')
      password = form.cleaned_data.get('password') 

      user = authenticate(username=username, password=password)
      
      if user is not None:
          if user.is_active:
              login(request, user)
              return redirect('/iot/')
          return JsonResponse({"message": "User has been disabled"})
      return JsonResponse({"message": "User does not exist"}, status=400)

    return JsonResponse({"message": "The username and password are incorrect"}, status=400)

class Logout(View):
  def get(self, request):
    logout(request)
    return redirect('/')
