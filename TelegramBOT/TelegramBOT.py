#
# BOOT TELEGRAM DATA
#
#
# Done! Congratulations on your new bot. You will find it at t.me/CarLocator_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.
#
# Use this token to access the HTTP API:
# 514548878:AAFDLMOAQjCWtjsdAEVAAdb1yiW4Rp_3VV0
#
# For a description of the Bot API, see this page: https://core.telegram.org/bots/api


import json
import requests
import mysql.connector as mdb

TOKEN = "514548878:AAFDLMOAQjCWtjsdAEVAAdb1yiW4Rp_3VV0"
URL = "https://api.telegram.org/bot{}/".format(TOKEN)


def get_url(url):
    response = requests.get(url)
    content = response.content.decode("utf8")
    return content


def get_json_from_url(url):
    content = get_url(url)
    js = json.loads(content)
    return js


def get_updates(offset):
    url = URL + "getUpdates?"
    url = url + "offset={}".format(offset)
    js = get_json_from_url(url)
    return js


def get_last_chat_id_and_text(updates):
    num_updates = len(updates["result"])
    last_update = num_updates - 1
    text = updates["result"][last_update]["message"]["text"]
    chat_id = updates["result"][last_update]["message"]["chat"]["id"]
    return (text, chat_id)


def send_message(text, chat_id):
    url = URL + "sendMessage?text={}&chat_id={}".format(text, chat_id)
    get_url(url)


connection = mdb.connect(user='root', password='CarLocator',
                         host='carlocator.cshcpypejvib.us-west-2.rds.amazonaws.com', database='CarLocator')
cursor = connection.cursor()


messages=get_updates(0)
for message in messages["result"]:
   # if(message["message"]["text"] == "ola"):
    print(message)