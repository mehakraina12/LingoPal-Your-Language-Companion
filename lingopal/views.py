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

language_mapping = {
    1: "Arabic",
    2: "Bengali",
    3: "Chinese (Mandarin)",
    4: "Dutch",
    5: "English",
    6: "French",
    7: "German",
    8: "Greek",
    9: "Gujarati",
    10: "Hindi",
    11: "Italian",
    12: "Japanese",
    13: "Kashmiri",
    14: "Korean",
    15: "Odia",
    16: "Punjabi",
    17: "Russian",
    18: "Spanish",
    19: "Telugu",
    20: "Urdu",
}

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

client = pymongo.MongoClient("mongodb+srv://lingopal:dOyEzWnB8ypRPeQP@lingopal.hymmldz.mongodb.net/lingopal_YLC")

db = client['lingopal_YLC']

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

        language_to_learn = request.POST.get('language_to_learn')
        about_me = request.POST.get('about_me')

        # Insert data into session to be saved after email verification
        request.session['user_data'] = {
            'name': name,
            'email': email,
            'username': username,
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
    context = {}

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')
            about_me = user_data.get('about_me')
            language_to_learn = user_data.get('language_to_learn')

            # Retrieve the language name from the mapping
            language_name = language_mapping.get(int(language_to_learn), "Unknown")

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,  # Add profile pic path to context
                'about_me': about_me,
                'language_to_learn': language_name
            }

    return render(request, 'profile.html', context)

def result_update(request):
    username = request.session.get('username')
    if request.method == 'POST':
        lang = request.POST.get('lang')
        score = request.POST.get('score')
        # Assuming you have a MongoDB connection named db
        native_languages_collection = db['users_native_langauges']
       # Update the user's score for the language
        native_languages_collection.update_one(
        {'username': username},
        {'$set': {f'{lang}': score}},
            upsert=True  
        )
    return render(request, 'language_test.html')

def user_language(request):
    username = request.session.get('username')
    context = {}

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')
            language_to_learn = user_data.get('language_to_learn')

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,
                'language_to_learn': language_to_learn
            }

    if request.method == 'POST':
        native_languages = request.POST.getlist('native_languages')

        # Check if language_to_learn and selected language are the same
        for language in native_languages:
            if language == language_to_learn:
                context['error_message'] = "Language to learn and language you want to teach cannot be the same!"
                return render(request, 'user_language.html', context)

        # Check if user language info already exists
        collection = db['users_languages_info']
        user_language_info = collection.find_one({'username': username})
        
        if user_language_info:
            # Append new languages to existing languages
            existing_languages = user_language_info.get('languages', [])
            updated_languages = list(set(existing_languages + native_languages))
            
            # Update existing user language info
            collection.update_one(
                {'username': username},
                {
                    "$set": {
                        'language_to_learn': language_to_learn,
                        'languages': updated_languages
                    }
                }
            )
        else:
            # Insert new user language info
            user_language_info = {
                'username': username,
                'language_to_learn': language_to_learn,
                'languages': native_languages
            }
            collection.insert_one(user_language_info)

        # Redirect the user to the test page or any other page as needed
        return redirect('language_test')  # Replace 'home_attempt' with the URL name of your desired page

    else:
        # Clear the error message if it exists
        context.pop('error_message', None)

    return render(request, 'user_language.html', context)


def language_test(request):
    username = request.session.get('username')
    context = {}

    if username:
        user_data = db['users_details'].find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            user_language_info = db['users_languages_info'].find_one({'username': username})

            if user_language_info:
                
                languages = [language_mapping.get(int(lang_id), 'Unknown') for lang_id in user_language_info.get('languages', [])]

            context = {
                    'username': username,
                    'name': name,
                    'profile_pic_path': profile_pic_path,
                    'languages': languages
                }

    return render(request, 'language_test.html', context)




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

from django.shortcuts import render, redirect

def settings_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            # Fetch user settings if available
            users_settings_info = db['users_settings_info']
            user_settings_data = users_settings_info.find_one({'username': username})

            # If user settings exist, extract individual settings
            if user_settings_data:
                notification = user_settings_data.get('notification')
                email_notification = user_settings_data.get('email_notification')
                chat_notification = user_settings_data.get('chat_notification')
                video_call_notification = user_settings_data.get('video_call_notification')
            else:
                # Provide default values if user settings do not exist
                notification = False
                email_notification = False
                chat_notification = False
                video_call_notification = False

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,
                'notification': notification,
                'email_notification': email_notification,
                'chat_notification': chat_notification,
                'video_call_notification': video_call_notification
            }
            
            if request.method == 'POST':
                # Process form submission and save/update settings data
                notification = request.POST.get('notification')
                email_notification = request.POST.get('email_notification')
                chat_notification = request.POST.get('chat_notification')
                video_call_notification = request.POST.get('video_call_notification')
                
                # Check if user settings already exist
                if user_settings_data:
                    # Update existing settings
                    users_settings_info.update_one(
                        {'username': username},
                        {
                            "$set": {
                                'notification': notification,
                                'email_notification': email_notification,
                                'chat_notification': chat_notification,
                                'video_call_notification': video_call_notification
                            }
                        }
                    )
                else:
                    # Insert new settings
                    settings_data = {
                        'username': username,
                        'notification': notification,
                        'email_notification': email_notification,
                        'chat_notification': chat_notification,
                        'video_call_notification': video_call_notification
                    }
                    users_settings_info.insert_one(settings_data)

                # Redirect back to the settings page after saving settings
                return redirect('settings_attempt')

    return render(request, 'settings.html', context)




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

def take_test(request, language):

    quiz_pages = {
    'Arabic': 'quiz_arabic.html',
    'Bengali': 'quiz_bengali.html',
    'Chinese (Mandarin)': 'quiz_chinese.html',
    'Dutch': 'quiz_dutch.html',
    'English': 'quiz_english.html',
    'French': 'quiz_french.html',
    'German': 'quiz_german.html',
    'Greek': 'quiz_greek.html',
    'Gujarati': 'quiz_gujarati.html',
    'Hindi': 'quiz_hindi.html',
    'Italian': 'quiz_italian.html',
    'Japanese': 'quiz_japanese.html',
    'Tamil': 'quiz_tamil.html',
    'Korean': 'quiz_korean.html',
    'Odia': 'quiz_odia.html',
    'Punjabi': 'quiz_punjabi.html',
    'Russian': 'quiz_russian.html',
    'Spanish': 'quiz_spanish.html',
    'Telugu': 'quiz_telugu.html',
    'Urdu': 'quiz_urdu.html',
}
    quiz_page = quiz_pages.get(language)

    return render(request, quiz_page)

