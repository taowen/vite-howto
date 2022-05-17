from urllib.request import Request
from django.shortcuts import render

def index(request: Request):
    return render(request, 'polls/index.html', {})