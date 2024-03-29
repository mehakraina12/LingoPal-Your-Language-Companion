"""lingopal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index,name="index"),
    path('register' , register_attempt , name="register_attempt"),
    path('logout' , logout_attempt , name="logout_attempt"),
    path('login' , login_attempt , name="login_attempt"),
    path('success' , success_attempt , name='success_attempt'),
    path('feedback' , feedback_attempt , name='feedback_attempt'),
    path('home' , home_attempt , name='home_attempt'),
    path('matches' , matches_attempt , name='matches_attempt'),
    path('profile' , profile_attempt , name='profile_attempt'),
    path('user_language' , user_language , name='user_language'),
     path('language_test' , language_test , name='language_test'),
    path('update_profile' , update_profile , name='update_profile'),
    path('quiz' , quiz_attempt , name='quiz_attempt'),
    path('resources' , resources_attempt , name='resources_attempt'),
    path('settings' , settings_attempt , name='settings_attempt'),
    path('teacher_profile' , teacher_profile_attempt , name='teacher_profile_attempt'),
    path('playlist' , playlist_attempt , name='playlist_attempt'),
    path('verify' , verify_attempt , name='verify_attempt'),
    path('verifyEmail' , VerifyOTP , name='verifyEmail'),
    path('take_test/<str:language>' , take_test , name='take_test'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

