import urllib.request
import json
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View

# Create your views here.
class SensorData(View):

  # get sensor_data from the weather api
  def get(self, request):
    try:
      response = urllib.request.urlopen("https://api.thingspeak.com/channels/12397/feeds.json")

      response_data = response.read()
      data = json.loads(response_data.decode("utf-8"))

      return render(request, 'sensor_data/sensor_data.html', {"context": data})
    except:
      return render(request, 'sensor_data/page_404.html')
