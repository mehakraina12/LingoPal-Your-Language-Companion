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
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
import requests
import base64
from .models import *
from datetime import datetime

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
    13: "Tamil",
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
            'password': hashed_password,
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
                # Add timestamp to database
                login_time = datetime.now()
                collection.update_one({'email': email}, {'$set': {'last_login': login_time}})

                request.session['username'] = reply['username']
                return redirect('home_attempt')  # Redirect to home page after successful login
            else:
                messages.error(request, "Check your password")
        else:
            messages.error(request, "Your email doesn't exist")

    return render(request, 'login.html',context)

def logout_attempt(request):
    # Clear user data from the session upon logout
    username = request.session.get('username')

    collection = db['users_details']
    login_time = datetime.now()
    collection.update_one({'username': username}, {'$set': {'last_login': login_time}})

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
                password=request.POST.get('password1')

                # Update the user's profile data in the database if the fields are provided
                if language_to_learn:
                    user_data['language_to_learn'] = language_to_learn
                if about_me:
                    user_data['about_me'] = about_me
                if password:
                    hashed_password=make_password(password)
                    user_data['password']=hashed_password

                profile_pic = request.FILES.get('profile_pic')
                if profile_pic:
                    imgbb_url = upload_to_imgbb(profile_pic)
                    if imgbb_url:
                        user_data['profile_pic_path'] = imgbb_url
                    else:
                        messages.error(request, 'Failed to upload profile picture.')
                        return redirect('update_profile')

                # Save the updated user data
                print(user_data)
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
def success_forgot(request):
    return render(request , 'success_forgot.html')
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

            if request.method == 'POST':
                name = request.POST.get('name')
                email = request.POST.get('email')
                phone_number = request.POST.get('number')
                feedback = request.POST.get('feedback')

                if name and email and phone_number and feedback:
                    # Insert feedback data into the database
                    feedback_data = {
                        'username': username,
                        'name': name,
                        'email': email,
                        'phone_number': phone_number,
                        'feedback': feedback
                    }
                    collection = db['users_feedback']
                    collection.insert_one(feedback_data)

                    # Optionally, you can redirect the user to a thank you page or render a success message
                    context['feedback_sent'] = True

            # If not a POST request or missing form data, render the feedback.html template
            return render(request, 'feedback.html', context)

    # Handle case where username is not found or user_data is None
    return HttpResponse("User data not found.")

# def generate_random_group_name():
#     """Generate a random group name."""
#     letters = string.ascii_letters
#     return ''.join(random.choice(letters) for _ in range(8))  # Adjust length as needed


def home_attempt(request):
    username = request.session.get('username')

    if username:
        collection = db['users_details']
        user_data = collection.find_one({'username': username})

        if user_data:
            name = user_data.get('name')
            profile_pic_path = user_data.get('profile_pic_path')

            # Find all senders and receivers with status "accepted"
            requests_collection = db['users_requests']
            sender_requests = requests_collection.find({'receiver_username': username, 'status': 'accepted'})
            receiver_requests = requests_collection.find({'sender_username': username, 'status': 'accepted'})

            # Extract sender and receiver usernames from the requests
            sender_usernames = [request['sender_username'] for request in sender_requests]
            receiver_usernames = [request['receiver_username'] for request in receiver_requests]

            # Fetch details of senders and receivers from users_details
            sender_details = list(collection.find({'username': {'$in': sender_usernames}}))  # Convert to list
            receiver_details = list(collection.find({'username': {'$in': receiver_usernames}}))  # Convert to list
            for sender_detail in sender_details:
                language_to_learn_str = sender_detail.get('language_to_learn', '')
                language_to_learn = int(language_to_learn_str) if language_to_learn_str.isdigit() else None
                sender_detail['language_to_learn'] = language_mapping.get(language_to_learn, 'Unknown')

            for receiver_detail in receiver_details:
                language_to_learn_str = receiver_detail.get('language_to_learn', '')
                language_to_learn = int(language_to_learn_str) if language_to_learn_str.isdigit() else None
                receiver_detail['language_to_learn'] = language_mapping.get(language_to_learn, 'Unknown')

            # # Generate a random group name
            # group_name = generate_random_group_name()

            # # Send email to senders
            # for sender_detail in sender_details:
            #     sender_email = sender_detail.get('email')  # Assuming email field exists in user details
            #     if sender_email:
            #         send_mail(
            #             'Group Name',
            #             f'Your group name is {group_name}.',
            #             'from@example.com',
            #             [sender_email],
            #             fail_silently=False,
            #         )

            # # Send email to receivers
            # for receiver_detail in receiver_details:
            #     receiver_email = receiver_detail.get('email')  # Assuming email field exists in user details
            #     if receiver_email:
            #         send_mail(
            #             'Group Name',
            #             f'Your group name is {group_name}.',
            #             'from@example.com',
            #             [receiver_email],
            #             fail_silently=False,
            #         )

            context = {
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,
                'sender_details': sender_details,  # Sender details queryset
                'receiver_details': receiver_details
            }
    else:
        context = {}  # No username in session, empty context

    return render(request, 'home.html', context)

def matches_attempt(request):
    username = request.session.get('username')

    if username:
        # Connect to MongoDB  # Replace with your MongoDB connection details
        collection = db['users_details']
        experts_collection = db['users_experts']
        requests_collection = db['users_requests']

        # Find the current user's data
        user_data = collection.find_one({'username': username})
        name = user_data.get('name')
        profile_pic_path = user_data.get('profile_pic_path')

        if user_data:
            # Get the language number the current user wants to learn
            language_number_to_learn_str = user_data.get('language_to_learn')
            language_number_to_learn = int(language_number_to_learn_str)

            # Map language number to language name
            language_to_learn = language_mapping.get(language_number_to_learn)

            # Find users whose native languages intersect with the language the current user wants to learn
            matched_users = collection.find({'native_languages': language_to_learn})
            matched_user_data = [
                (
                    user.get('username'), 
                    user.get('email'), 
                    user.get('native_languages'), 
                    language_mapping.get(int(user.get('language_to_learn')), 'Unknown'),
                    None,  # Placeholder for "languages to teach" for users
                    user.get('profile_pic_path'),
                ) 
                for user in matched_users
            ]

            if not matched_user_data:  # If no matched users found, fetch data from experts
                matched_experts = experts_collection.find({'language_to_teach': language_to_learn})
                matched_expert_data = [
                    (
                        expert.get('name'), 
                        expert.get('email'), 
                        [],  # Placeholder for "languages known" for experts
                        None,  # Placeholder for "languages to learn" for experts
                        expert.get('language_to_teach'),  # "Languages to teach" for experts
                        expert.get('profile_pic_path')
                    ) 
                    for expert in matched_experts
                ]
                all_matched_data = matched_expert_data
            else:
                all_matched_data = matched_user_data

            # Find all pending requests where the current user is the receiver
            received_requests = list(requests_collection.find({'receiver_username': username, 'status': 'pending'}))

            # Remove accepted requests from received requests
            received_requests = [req for req in received_requests if req.get('status') != 'accepted']

            # Remove users who have sent accepted requests from matched users
            accepted_requests = list(requests_collection.find({'receiver_username': username, 'status': 'accepted'}))
            accepted_usernames = [req.get('sender_username') for req in accepted_requests]
            all_matched_data = [user for user in all_matched_data if user[0] not in accepted_usernames]

            # Remove the receiver's profile from sender's matches if the request is accepted
            for req in accepted_requests:
                sender_username = req.get('sender_username')
                sender_matched_users = list(collection.find({'username': sender_username}))
                sender_matched_user_data = [
                    (
                        user.get('username'), 
                        user.get('email'), 
                        user.get('native_languages'), 
                        language_mapping.get(int(user.get('language_to_learn')), 'Unknown'),
                        None,  # Placeholder for "languages to teach" for users
                        user.get('profile_pic_path'),
                    ) 
                    for user in sender_matched_users
                ]
                sender_matched_user_data = [user for user in sender_matched_user_data if user[0] != username]
                collection.update_one({'username': sender_username}, {'$set': {'matched_user_data': sender_matched_user_data}})

            # Remove the sender's profile from receiver's matches if the request is accepted
            for req in accepted_requests:
                receiver_username = req.get('receiver_username')
                receiver_matched_users = list(collection.find({'username': receiver_username}))
                receiver_matched_user_data = [
                    (
                        user.get('username'), 
                        user.get('email'), 
                        user.get('native_languages'), 
                        language_mapping.get(int(user.get('language_to_learn')), 'Unknown'),
                        None,  # Placeholder for "languages to teach" for users
                        user.get('profile_pic_path'),
                    ) 
                    for user in receiver_matched_users
                ]
                receiver_matched_user_data = [user for user in receiver_matched_user_data if user[0] != username]
                collection.update_one({'username': receiver_username}, {'$set': {'matched_user_data': receiver_matched_user_data}})

            context = {
                'matched_usernames': all_matched_data,
                'username': username,
                'name': name,
                'profile_pic_path': profile_pic_path,
                'received_requests': received_requests,
            }

            return render(request, 'matches.html', context)
    
    # Handle the case where the user is not logged in or doesn't have details
    return render(request, 'matches.html', {})


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

                # Fetch scores for each language from the users_native_languages collection
                language_scores = {}
                user_native_languages = db['users_native_langauges'].find_one({'username': username})
                if user_native_languages:  # Check if user_native_languages is not None
                    for language in languages:
                        language_score = user_native_languages.get(language)
                        if language_score is not None:
                            language_score = int(language_score)
                        language_scores[language] = language_score
                else:
                    # If user_native_languages is None, create a new document with default scores
                    default_scores = {language: None for language in languages}
                    db['users_native_langauges'].insert_one({'username': username, **default_scores})
                    language_scores = default_scores

                language_score_list = [(language, language_scores[language]) for language in languages]

                context = {
                    'username': username,
                    'name': name,
                    'profile_pic_path': profile_pic_path,
                    'languages': languages,
                    'language_score_list': language_score_list,  # Pass language scores as a list of tuples
                }

                # Update native_languages field if score is >= 8
                for lang_id, score in language_score_list:
                    if score is not None and score >= 8:
                        db['users_details'].update_one(
                            {'username': username},
                            {'$addToSet': {'native_languages': lang_id}}
                        )

    return render(request, 'language_test.html', context)

def quiz_attempt(request):
    return render(request , 'quiz.html')
def quiz_beginner_arabic(request):
    return render(request , 'quiz_beginner_arabic.html')
def quiz_intermediate_arabic(request):
    return render(request , 'quiz_intermediate_arabic.html')
def quiz_advanced_arabic(request):
    return render(request , 'quiz_advanced_arabic.html')
def quiz_beginner_bengali(request):
    return render(request , 'quiz_beginner_bengali.html')
def quiz_intermediate_bengali(request):
    return render(request , 'quiz_intermediate_bengali.html')
def quiz_advanced_bengali(request):
    return render(request , 'quiz_advanced_bengali.html')
def quiz_beginner_chinese(request):
    return render(request , 'quiz_beginner_chinese.html')
def quiz_intermediate_chinese(request):
    return render(request , 'quiz_intermediate_chinese.html')
def quiz_advanced_chinese(request):
    return render(request , 'quiz_advanced_chinese.html')
def quiz_beginner_dutch(request):
    return render(request , 'quiz_beginner_dutch.html')
def quiz_intermediate_dutch(request):
    return render(request , 'quiz_intermediate_dutch.html')
def quiz_advanced_dutch(request):
    return render(request , 'quiz_advanced_dutch.html')
def quiz_beginner_english(request):
    return render(request , 'quiz_beginner_english.html')
def quiz_intermediate_english(request):
    return render(request , 'quiz_intermediate_english.html')
def quiz_advanced_english(request):
    return render(request , 'quiz_advanced_english.html')
def quiz_beginner_french(request):
    return render(request , 'quiz_beginner_french.html')
def quiz_intermediate_french(request):
    return render(request , 'quiz_intermediate_french.html')
def quiz_advanced_french(request):
    return render(request , 'quiz_advanced_french.html')
def quiz_beginner_german(request):
    return render(request , 'quiz_beginner_german.html')
def quiz_intermediate_german(request):
    return render(request , 'quiz_intermediate_german.html')
def quiz_advanced_german(request):
    return render(request , 'quiz_advanced_german.html')
def quiz_beginner_greek(request):
    return render(request , 'quiz_beginner_greek.html')
def quiz_intermediate_greek(request):
    return render(request , 'quiz_intermediate_greek.html')
def quiz_advanced_greek(request):
    return render(request , 'quiz_advanced_greek.html')
def quiz_beginner_gujarati(request):
    return render(request , 'quiz_beginner_gujarati.html')
def quiz_intermediate_gujarati(request):
    return render(request , 'quiz_intermediate_gujarati.html')
def quiz_advanced_gujarati(request):
    return render(request , 'quiz_advanced_gujarati.html')
def quiz_beginner_spanish(request):
    return render(request , 'quiz_beginner_spanish.html')
def quiz_intermediate_spanish(request):
    return render(request , 'quiz_intermediate_spanish.html')
def quiz_advanced_spanish(request):
    return render(request , 'quiz_advanced_spanish.html')
def quiz_beginner_hindi(request):
    return render(request , 'quiz_beginner_hindi.html')
def quiz_intermediate_hindi(request):
    return render(request , 'quiz_intermediate_hindi.html')
def quiz_advanced_hindi(request):
    return render(request , 'quiz_advanced_hindi.html')
def quiz_beginner_italian(request):
    return render(request , 'quiz_beginner_italian.html')
def quiz_intermediate_italian(request):
    return render(request , 'quiz_intermediate_italian.html')
def quiz_advanced_italian(request):
    return render(request , 'quiz_advanced_italian.html')
def quiz_beginner_japanese(request):
    return render(request , 'quiz_beginner_japanese.html')
def quiz_intermediate_japanese(request):
    return render(request , 'quiz_intermediate_japanese.html')
def quiz_advanced_japanese(request):
    return render(request , 'quiz_advanced_japanese.html')
def quiz_beginner_korean(request):
    return render(request , 'quiz_beginner_korean.html')
def quiz_intermediate_korean(request):
    return render(request , 'quiz_intermediate_korean.html')
def quiz_advanced_korean(request):
    return render(request , 'quiz_advanced_korean.html')
def quiz_beginner_odia(request):
    return render(request , 'quiz_beginner_odia.html')
def quiz_intermediate_odia(request):
    return render(request , 'quiz_intermediate_odia.html')
def quiz_advanced_odia(request):
    return render(request , 'quiz_advanced_odia.html')
def quiz_beginner_punjabi(request):
    return render(request , 'quiz_beginner_punjabi.html')
def quiz_intermediate_punjabi(request):
    return render(request , 'quiz_intermediate_punjabi.html')
def quiz_advanced_punjabi(request):
    return render(request , 'quiz_advanced_punjabi.html')
def quiz_beginner_russian(request):
    return render(request , 'quiz_beginner_russian.html')
def quiz_intermediate_russian(request):
    return render(request , 'quiz_intermediate_russian.html')
def quiz_advanced_russian(request):
    return render(request , 'quiz_advanced_russian.html')
def quiz_beginner_tamil(request):
    return render(request , 'quiz_beginner_tamil.html')
def quiz_intermediate_tamil(request):
    return render(request , 'quiz_intermediate_tamil.html')
def quiz_advanced_tamil(request):
    return render(request , 'quiz_advanced_tamil.html')
def quiz_beginner_telugu(request):
    return render(request , 'quiz_beginner_telugu.html')
def quiz_intermediate_telugu(request):
    return render(request , 'quiz_intermediate_telugu.html')
def quiz_advanced_telugu(request):
    return render(request , 'quiz_advanced_telugu.html')
def quiz_beginner_urdu(request):
    return render(request , 'quiz_beginner_urdu.html')
def quiz_intermediate_urdu(request):
    return render(request , 'quiz_intermediate_urdu.html')
def quiz_advanced_urdu(request):
    return render(request , 'quiz_advanced_urdu.html')

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

def playlist_arabic(request):
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

    return render(request , 'playlist_arabic.html',context)

def playlist_bengali(request):
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

    return render(request , 'playlist_bengali.html',context)

def playlist_chinese(request):
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

    return render(request , 'playlist_chinese.html',context)

def playlist_dutch(request):
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

    return render(request , 'playlist_dutch.html',context)

def playlist_english(request):
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

    return render(request , 'playlist_english.html',context)

def playlist_french(request):
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

    return render(request , 'playlist_french.html',context)

def playlist_german(request):
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

    return render(request , 'playlist_german.html',context)

def playlist_greek(request):
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

    return render(request , 'playlist_greek.html',context)

def playlist_gujarati(request):
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

    return render(request , 'playlist_gujarati.html',context)

def playlist_hindi(request):
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

    return render(request , 'playlist_hindi.html',context)

def playlist_italian(request):
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

    return render(request , 'playlist_italian.html',context)

def playlist_japanese(request):
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

    return render(request , 'playlist_japanese.html',context)

def playlist_tamil(request):
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

    return render(request , 'playlist_tamil.html',context)

def playlist_korean(request):
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

    return render(request , 'playlist_korean.html',context)

def playlist_odia(request):
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

    return render(request , 'playlist_odia.html',context)

def playlist_punjabi(request):
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

    return render(request , 'playlist_punjabi.html',context)

def playlist_russian(request):
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

    return render(request , 'playlist_russian.html',context)

def playlist_spanish(request):
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

    return render(request , 'playlist_spanish.html',context)

def playlist_telugu(request):
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

    return render(request , 'playlist_telugu.html',context)

def playlist_urdu(request):
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

    return render(request , 'playlist_urdu.html',context)


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

def chatroom(request):
    username = request.session.get('username')
    collection = db['users_details']
    user_data = collection.find_one({'username': username})
    name = user_data.get('name')
    if user_data:
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'name': name,
                'username': username,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }
    return render(request,'chatroom.html',context)

def room(request, room):
    collection = db['users_room']  # Replace 'users_details' with your actual collection name
    collection2 = db['users_details']
    username = request.session.get('username')
    user_data = collection2.find_one({'username': username})
    name = user_data.get('name')
    room_details = collection.find_one({'name': room})
    if user_data:
            profile_pic_path = user_data.get('profile_pic_path')

            context = {
                'name': name,
                'username': username,
                'room': room,
                'profile_pic_path': profile_pic_path  # Add profile pic path to context
            }
    # Check if the room exists in the users_details collection
    if room_details:
        # If the room exists, render the room.html template
        return render(request, 'room.html',context)
    return JsonResponse({'data': 'Hello'}, status=200)

def checkview(request):
    if request.method == 'POST':
        room_name = request.POST.get('room_name')  # Retrieve email from POST data
        request.session['room_name'] = room_name

    username = request.session.get('username')
       
    collection=db['users_room']

    # Check if the room exists in MongoDB
    existing_room = collection.find_one({'name': room_name})
    if existing_room:
        return redirect(f'/{room_name}/?username={username}')
    else:
        # Create the room in MongoDB
        collection.insert_one({"name": room_name})
        return redirect(f'/{room_name}/?username={username}')
    
def send(request):
    if request.method == 'POST':
        # Retrieve room_name and username from session
        room_name = request.session.get('room_name')
        username = request.session.get('username')
        collection2 = db['users_details']
        user_data = collection2.find_one({'username': username})
        if user_data:
            profile_pic_path = user_data.get('profile_pic_path')
            
        if room_name and username:
            message_content = request.POST.get('message')

            # Retrieve existing messages for the room
            users_message_collection = db['users_message']
            existing_messages = users_message_collection.find_one({'room_name': room_name})

            if existing_messages:
                # If there are existing messages, append the new message to the list
                messages_list = existing_messages.get('messages', [])
                current_datetime = datetime.now()
                messages_list.append({'username': username, 'message': message_content, 'timestamp': current_datetime, 'profile_pic_path': profile_pic_path})
                # Update the existing document with the new messages list
                users_message_collection.update_one({'room_name': room_name}, {'$set': {'messages': messages_list}})
            else:
                # If there are no existing messages, create a new document for the room
                current_datetime = datetime.now()
                users_message_collection.insert_one({
                    'room_name': room_name,
                    'messages': [{'username': username, 'message': message_content, 'timestamp': current_datetime, 'profile_pic_path': profile_pic_path}]
                })

            return JsonResponse({'status': 'success', 'message': 'Message sent successfully'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Room name or username not found in session'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
    

import pytz
def getMessages(request, room):  
    collection = db['users_message']
    users_details_collection = db['users_details']

    username12 = request.session.get('username')

    room_name = request.session.get('room_name')
    result = collection.find_one({'room_name': room_name})  # Use the 'room' parameter directly
    if result:
        messages = result.get('messages', [])
        for message in messages:
            timestamp = datetime.now(pytz.timezone('Asia/Kolkata'))
            if timestamp:
                formatted_time = timestamp.strftime('%I:%M %p')  # Format as '12:30 AM/PM'
                message['timestamp'] = formatted_time
            
            username = message.get('username')
            if username != username12:
                user_data = users_details_collection.find_one({'username': username12})
                if user_data:
                    last_login = user_data.get('last_login')
                    if last_login:
                        formatted_last_login = last_login.strftime('%I:%M %p')  # Format last login time
                        message['last_login'] = formatted_last_login
            else:
                user_data = users_details_collection.find_one({'username': username})
                if user_data:
                    profile_pic_path = user_data.get('profile_pic_path')
                    message['profile_pic_path'] = profile_pic_path
    else:
        messages = []   
    return JsonResponse({"messages": messages})


def dashboard(request):
    
    # Select the collection
    collection = db['users_details']
    
    # Retrieve the username from the session if available
    username = request.session.get('username')
    
    # If username is available, query the database to get the user's name
    if username:
        user_data = collection.find_one({'username': username})
        profile_pic_path = user_data.get('profile_pic_path')
        if user_data:
            name = user_data.get('name', 'Guest')  # Default to 'Guest' if name is not available
        else:
            name = 'Guest'
    else:
        name = 'Guest'
    
    # Pass the name to the template context
    context = {
        'name': name,
        'username': username,
        'profile_pic_path': profile_pic_path
        }
    
    return render(request, 'dashboard.html', context)

def videocall(request):
    db =client['lingopal_YLC']
    
    # Select the collection
    collection = db['users_details']
    
    # Retrieve the username from the session if available
    username = request.session.get('username')
    
    # If username is available, query the database to get the user's name
    if username:
        user_data = collection.find_one({'username': username})
        if user_data:
            name = user_data.get('name', 'Guest')  # Default to 'Guest' if name is not available
        else:
            name = 'Guest'
    else:
        name = 'Guest'
    
    # Pass the name to the template context
    context = {'name': name}
    return render(request, 'videocall.html',context)

def join_room(request):
    db =client['lingopal_YLC']
    
        # Select the collection
    collection = db['users_details']
        
        # Retrieve the username from the session if available
    username = request.session.get('username')
    if username:
        user_data = collection.find_one({'username': username})
        name=user_data.get('name')
        profile_pic_path=user_data.get('profile_pic_path')
        
        # Pass the name to the template context
    context = {
            'name': name,
            'username': username,
            'profile_pic_path': profile_pic_path
            }
    if request.method=='POST':
        roomID=request.POST['roomID']
        return redirect("/meeting?roomID="+roomID)
    return render(request,'joinroom.html',context)

def verify_forgot(request):
    return render(request , 'verify_forgot.html')

@csrf_exempt
def VerifyForgot(request):
    print("Hello")
    if request.method == "POST":
        email = request.session.get('email')  # Retrieve email from session
        if email:
            # Clear session data after successful insertion
            return JsonResponse({'data': 'Email verification successful'}, status=200)
        else:
            return JsonResponse({'error': 'Email not found in session'}, status=400)

def forgot_password(request):
    if request.method == 'POST':
        # Retrieve form data
        email = request.POST.get('email')
        request.session['email'] = email
        db = client['lingopal_YLC']
        collection = db['users_details']
        user_data = collection.find_one({'email': email})
        if user_data:
            request.session['email'] = email  # Store email in session
            print("This is forgot password email: ",email)
            # Generate and send verification email
            otp = random.randint(100000, 999999)
            send_mail("User Data: ", f"Verify your mail by the OTP: \n {otp}", EMAIL_HOST_USER, [email], fail_silently=True)
            return render(request, 'verify_forgot.html', {'otp': otp})
        else:
            return render(request, 'forgot_password.html', {'error': 'Email not found'})
    else:
        return render(request, 'forgot_password.html')

def update_password(request):
    context = {}  # Define context here with an empty dictionary
    if request.method == 'POST':
        print("hello")
        email = request.session.get('email')  # Retrieve email from session
        print(email)  # Check if email is retrieved properly
        if email:
            collection = db['users_details']
            user_data = collection.find_one({'email': email})

            if user_data:
                # Retrieve form data
                password = request.POST.get('password1')
                if password:
                    hashed_password = make_password(password)
                    # Update the password in user data
                    user_data['password'] = hashed_password
                    # Save the updated user data
                    collection.update_one({'email': email}, {"$set": user_data})
                    print(email)  # Check if email is retained after password update
                    print(password)  # Check if password is retrieved properly
                    return redirect('login_attempt')

    # If the request method is not POST or if there's an error, render the update password page
    email = request.session.get('email')
    print(email)  # Check if email is retrieved properly
    if email:
        collection = db['users_details']
        user_data = collection.find_one({'email': email})

        if user_data:
            # You can add other necessary data retrieval here if needed
            pass  # Placeholder, no additional data retrieval for now

    return render(request, 'update_password.html', context)

def send_request(request):
    if request.method == 'POST':
            sender_username = request.session.get('username')
            receiver_username = request.POST.get('receiver_username')

            # Ensure both sender and receiver usernames are available
            if sender_username and receiver_username:
                requests_collection = db['users_requests']
                
                # Ensure unique index on sender and receiver usernames
                requests_collection.create_index([('sender_username', 1), ('receiver_username', 1)], unique=True)
                
                # Attempt to insert the request document
                try:
                    request_doc = {
                        'sender_username': sender_username,
                        'receiver_username': receiver_username,
                        'status': 'pending'
                    }
                    requests_collection.insert_one(request_doc)
                except Exception as e:
                    # Handle the case where the combination already exists
                    # You might want to log this or inform the user
                    print("Error:", e)

    return render(request, 'matches.html')

def accept_request(request):
    # Extract sender_id and receiver_id from request.POST  
    sender_username = request.session.get('username')
    send_name = request.POST.get('send_name')

    print(sender_username)
    print(send_name)

    requests_collection = db['users_requests']

    # Update status of request to "accepted"
    requests_collection.update_one(
        {'sender_username': send_name, 'receiver_username': sender_username},
        {'$set': {'status': 'accepted'}}
    )
    return render(request, 'matches.html')

def decline_request(request):
    # Extract sender_id and receiver_id from request.POST
    sender_username = request.session.get('username')
    send_name = request.POST.get('send_name')

    print(sender_username)
    print(send_name)

    requests_collection = db['users_requests']

    # Update status of request to "accepted"
    requests_collection.update_one(
        {'sender_username': send_name, 'receiver_username': sender_username},
        {'$set': {'status': 'declined'}}
    )
    return render(request, 'matches.html')