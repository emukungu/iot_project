from django.urls import path
from django.conf import settings
from .views import SensorData
from django.views.decorators.cache import cache_page
from django.core.cache.backends.base import DEFAULT_TIMEOUT

app_name = 'iot_weather'

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

urlpatterns = (
  path('', cache_page(CACHE_TTL)(SensorData.as_view()), name='iot_weather'),
)
