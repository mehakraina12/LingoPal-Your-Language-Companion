from django.shortcuts import render, redirect
import pymongo
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.conf import settings
import os
from django.contrib import messages
from django.contrib.auth.hashers import make_password,check_password
from lingopal.forms import CreateUserForm
from django.core.mail import send_mail
from lingopal.settings import EMAIL_HOST_USER
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
import requests

import base64

def upload_to_imgbb(image_file):
    url = "https://api.imgbb.com/1/upload"
    image_data = base64.b64encode(image_file.read()).decode('utf-8')  # Encode image data to base64
    payload = {
        "key": "dd80692be19a4ad4f29e084d710255f5",  # Replace with your ImgBB API key
        "image": image_data
    }
    response = requests.post(url, payload)
    print(response.content)  # Print response content for debugging
    return response.json()["data"]["url"]





# from .models import UserProfile, Language
client = pymongo.MongoClient("mongodb+srv://lingopal:dOyEzWnB8ypRPeQP@lingopal.hymmldz.mongodb.net/lingopal_YLC")

db = client['lingopal_YLC']
# collection = db['mycollection']

@csrf_exempt
def VerifyOTP(request):
    print("Hello")
    if request.method == "POST":
            user_data = request.session['user_data']
            print(user_data)
            db['users_details'].insert_one(user_data)
            # Clear session data after successful insertion
            del request.session['user_data']
    return JsonResponse({'data': 'Hello'}, status=200) 


def register_attempt(request):
    if request.method == 'POST':
        # Retrieve form data
        name = request.POST.get('name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password1')

        existing_username = db['users_details'].find_one({'username': username})
        if existing_username:
            messages.error(request, 'Username already exists. Please use a different username.')
            return redirect('register_attempt') 

        existing_user = db['users_details'].find_one({'email': email})
        if existing_user:
            messages.error(request, 'Email already exists. Please use a different email.')
            return redirect('register_attempt')  

        hashed_password = make_password(password)

        imgbb_url = None
        if 'profile_pic' in request.FILES:
            profile_pic = request.FILES['profile_pic']
            imgbb_url = upload_to_imgbb(profile_pic)
            if imgbb_url is None:
                messages.error(request, 'Failed to upload profile picture.')
                return redirect('register_attempt')

        native_languages = request.POST.getlist('native_languages')
        language_to_learn = request.POST.get('language_to_learn')
        about_me = request.POST.get('about_me')

        # Insert data into session to be saved after email verification
        request.session['user_data'] = {
            'name': name,
            'email': email,
            'username': username,
            'password': hashed_password,
            'native_languages': native_languages,
            'language_to_learn': language_to_learn,
            'about_me': about_me,
            'profile_pic_path': imgbb_url,
        }

        # Generate and send verification email
        otp = random.randint(100000, 999999)
        send_mail("User Data: ", f"Verify your mail by the OTP: \n {otp}",EMAIL_HOST_USER, [email], fail_silently=True)
        return render(request,'verify.html', {'otp': otp})
    else:
        return render(request, 'register.html')

def login_attempt(request):
    collection = db['users_details']
    context={}
    
    if request.method == 'POST':
        email = request.POST.get('email')  # Retrieve email from POST data
        password = request.POST.get('password')

        reply = collection.find_one({'email': email})
        if reply:
            if check_password(password, reply['password']):
                request.session['username'] = reply['username']
                messages.success(request, "You have been logged in successfully!")
                return redirect('home_attempt')  # Redirect to home page after successful login
            else:
                messages.error(request, "Check your password")
        else:
            messages.error(request, "Your email doesn't exist")

    return render(request, 'login.html',context)

def logout_attempt(request):
    # Clear user data from the session upon logout
    if 'user_id' in request.session:
        del request.session['user_id']
    if 'username' in request.session:
        del request.session['username']

    messages.info(request, "You have been logged out.")
    return redirect('index')

def update_profile(request):
    if request.method == 'POST':
        username = request.session.get('username')
        if username:
            collection = db['users_details']
            user_data = collection.find_one({'username': username})

            if user_data:
                # Retrieve form data
                language_to_learn = request.POST.get('language_to_learn')
                about_me = request.POST.get('about_me')

                # Update the user's profile data in the database if the fields are provided
                if language_to_learn:
                    user_data['language_to_learn'] = language_to_learn
                if about_me:
                    user_data['about_me'] = about_me

                profile_pic = request.FILES.get('profile_pic')
                if profile_pic:
                    imgbb_url = upload_to_imgbb(profile_pic)
                    if imgbb_url:
                        user_data['profile_pic_path'] = imgbb_url
                    else:
                        messages.error(request, 'Failed to upload profile picture.')
                        return redirect('update_profile')

                # Save the updated user data
                collection.update_one({'username': username}, {"$set": user_data})
                messages.success(request, 'Profile updated successfully!')
                return redirect('profile_attempt')

    # If the request method is not POST or if there's an error, render the update profile page
    username = request.session.get('username')
    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request, 'update_profile.html', context)


def index(request):
    return render(request , 'index.html')
def success(request):
    return render(request , 'success.html')
def token_send(request):
    return render(request , 'token_send.html')
def success_attempt(request):
    return render(request , 'success.html')
def feedback_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request, 'feedback.html', context)

def home_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request, 'home.html',context)



def matches_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request , 'matches.html',context)

def profile_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')
            about_me = user_data.get('about_me')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,  # Add profile pic path to context
                'about_me': about_me
            }

    return render(request , 'profile.html',context)

def quiz_attempt(request):
    return render(request , 'quiz.html')
def resources_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request , 'resources.html',context)

def settings_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request , 'settings.html',context)

def teacher_profile_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request , 'teacher_profile.html',context)

def verify_attempt(request):
    return render(request , 'verify.html')

def playlist_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }

    return render(request , 'playlist.html',context)