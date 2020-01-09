from django.test import TestCase
from django.urls import reverse

# Create your tests here.
class UserTest(TestCase):

  def setUp(self):

    self.response = self.client.post('/auth/signup/', 
                {'first_name': 'esther', 
                'last_name':'muk', 'username': 'esther',
                'password': '123456muk','email': 'emuk@gmail.com',
                })
    
    self.login_response = self.client.post('/auth/login/', 
                {'username': 'esther',
                'password': '123456muk'
                })

  def test_successful_signup(self):
    self.assertEqual(self.response.status_code, 302)
    self.assertTrue(self.response.url.startswith('/iot/'))

  def test_failed_signup(self):
    response = self.client.post('/auth/signup/', 
                {'first_name': '', 
                'last_name':'muk', 'username': '',
                'password': '12345muk','email': 'em@gmail.com',
                })
    self.assertEqual(response.status_code, 400)

  def test_succesful_login(self):
    self.assertEqual(self.login_response.status_code, 302)
    self.assertTrue(self.login_response.url.startswith('/iot/'))

  def test_failed_login(self):
    res = self.client.post('/auth/login/', 
                {'username': '',
                'password': ''
                })
    self.assertEqual(res.status_code, 400)
  
  def test_display_signup_page(self):
    res = self.client.get('/auth/signup')
    self.assertTrue(res.url.startswith('/auth/signup/'))

  def test_display_login_page(self):
    res = self.client.get('/auth/login')
    self.assertTrue(res.url.startswith('/auth/login/'))

  def test_logout(self):
    res = self.client.get('/auth/logout/')
    self.assertTrue(res.url.startswith('/'))
