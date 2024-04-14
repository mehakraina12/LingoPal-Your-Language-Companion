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
    path('playlist_arabic' , playlist_arabic , name='playlist_arabic'),
    path('playlist_bengali' , playlist_bengali , name='playlist_bengali'),
    path('playlist_chinese' , playlist_chinese , name='playlist_chinese'),
    path('playlist_dutch' , playlist_dutch , name='playlist_dutch'),
    path('playlist_english' , playlist_english , name='playlist_english'),
    path('playlist_french' , playlist_french , name='playlist_french'),
    path('playlist_german' , playlist_german , name='playlist_german'),
    path('playlist_greek' , playlist_greek , name='playlist_greek'),
    path('playlist_gujarati' , playlist_gujarati , name='playlist_gujarati'),
    path('playlist_hindi' , playlist_hindi , name='playlist_hindi'),
    path('playlist_italian' , playlist_italian , name='playlist_italian'),
    path('playlist_japanese' , playlist_japanese , name='playlist_japanese'),
    path('playlist_tamil' , playlist_tamil , name='playlist_tamil'),
    path('playlist_korean' , playlist_korean , name='playlist_korean'),
    path('playlist_odia' , playlist_odia , name='playlist_odia'),
    path('playlist_punjabi' , playlist_punjabi , name='playlist_punjabi'),
    path('playlist_russian' , playlist_russian , name='playlist_russian'),
    path('playlist_spanish' , playlist_spanish , name='playlist_spanish'),
    path('playlist_telugu' , playlist_telugu , name='playlist_telugu'),
    path('playlist_urdu' , playlist_urdu , name='playlist_urdu'),
    path('verify' , verify_attempt , name='verify_attempt'),
    path('verifyEmail' , VerifyOTP , name='verifyEmail'),
    path('verifyForgot' , VerifyForgot , name='verifyForgot'),
    path('take_test/<str:language>' , take_test , name='take_test'),
    path('result_update' , result_update , name='result_update'),
    path('chatroom' , chatroom , name='room_attempt'),
    path('<str:room>/' , room , name='room'),
    path('checkview' , checkview , name='checkview'),
    path('send' , send , name='send'),
    path('getMessages/<str:room>/' , getMessages , name='getMessages'),
    path('dashboard' , dashboard , name='dashboard'),
    path('meeting' , videocall , name='meeting'),
    path('join' , join_room , name='join'),
    path('forgot_password' , forgot_password , name='forgot_password'),
    path('verify_forgot' , verify_forgot , name='verify_forgot'),
    path('update_password' , update_password , name='update_password'),
    path('success_forgot' , success_forgot , name='success_forgot'),
    path('send_request', send_request, name='send_request'),
    path('accept_request', accept_request, name='accept_request'),
    path('decline_request', decline_request, name='decline_request'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

