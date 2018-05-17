#
# BOOT TELEGRAM DATA
#
#
# Done! Congratulations on your new bot. You will find it at t.me/CarLocator_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.
#
# Use this token to access the HTTP API:
# 
#
# For a description of the Bot API, see this page: https://core.telegram.org/bots/api


import json
import requests
import mysql.connector as mdb
import sys

TOKEN = ""
TOKEN = sys.argv[
    1]  # Añadir el token en run>edit configuration en interpreter options poner -s y en parameters el token entre comillas
URL = "https://api.telegram.org/bot{}/".format(TOKEN)
readed = 0


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


def register_database(connection, cursor, DNI, ID, chat_id):
    cursor.execute(
        "INSERT INTO TelegramBOT (ID_Client, DNI_Client, ID_Chat) VALUES (%s,%s,%s)", (ID, DNI, chat_id))
    connection.commit()


def check_client(cursor, DNI, ID):
    cursor.execute("SELECT * from TelegramBOT WHERE DNI_Client=%s AND ID_Client=%s", (DNI, ID))
    row = cursor.fetchall()
    print(row)
    if (len(row) > 0): return -1
    cursor.execute("SELECT ID from ClientData WHERE DNI=%s AND ID=%s", (DNI, ID))
    row = cursor.fetchall()
    if len(row) != 0:
        return 1
    else:
        return 0


def check_telegram(cursor, chat_id):
    cursor.execute("SELECT * from TelegramBOT WHERE ID_Chat=%s", (chat_id,))
    row = cursor.fetchall()
    if len(row) == 0:
        return 0
    else:
        return 1


def unregister_database(connection, cursor, chat_id):
    cursor.execute("DELETE FROM TelegramBOT WHERE ID_Chat=%s", (chat_id,))
    connection.commit()


connection = mdb.connect(user='root', password='CarLocator',
                         host='carlocator.cshcpypejvib.us-west-2.rds.amazonaws.com', database='CarLocator')
cursor = connection.cursor()
while (1):
    messages = get_updates(readed)
    if len(messages["result"]) > 0:
        readed = messages["result"][0]["update_id"]

    for message in messages["result"]:
        chat_id = message["message"]["chat"]["id"]
        if "text" in message["message"]:  # aqui van los comandos que bot puede leer
            if len(message["message"]["text"]) >= 13:
                if message["message"]["text"][0:9] == "/register":
                    number_of_spaces = 0
                    positions_white = []
                    for iterator, char in enumerate(message["message"]["text"]):
                        if (char == " "):
                            number_of_spaces += 1
                            positions_white.append(iterator)
                    if (number_of_spaces == 2):
                        DNI = message["message"]["text"][positions_white[0] + 1:positions_white[1]]
                        ID = message["message"]["text"][positions_white[1] + 1:]
                        status = check_client(cursor, DNI, ID)
                        print(status)
                        if status == 1:
                            register_database(connection, cursor, DNI, ID, chat_id)
                            send_message("User with DNI:{} and ID:{} has enabled subscription mode".format(DNI, ID),
                                         chat_id)
                        elif status == -1:
                            send_message("Client already has subscription enable", chat_id)
                        else:
                            send_message("Not a valid client please verify your submited data", chat_id)
                    else:
                        send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
                else:
                    send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
            elif len(message["message"]["text"]) == 6:
                if message["message"]["text"][0:6] == "/start":
                    send_message(
                        "Welcome to CarLocatorBOT\nYou can use /register DNI ID to enable information reciving \nYou can use /unregister to disable subscription",
                        chat_id)
                else:
                    send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
            elif len(message["message"]["text"]) == 5:
                if message["message"]["text"][0:5] == "/help":
                    send_message(
                        "Welcome to CarLocatorBOT\nYou can use /register DNI ID to enable information reciving \nYou can use /unregister to disable subscription",
                        chat_id)
                else:
                    send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
            elif len(message["message"]["text"]) == 11:
                if message["message"]["text"][0:12] == "/unregister":
                    if check_telegram(cursor, chat_id):
                        unregister_database(connection, cursor, chat_id)
                        send_message("Subscription has been disabled",
                                     chat_id)
                    else:
                        send_message("You are not subscribed", chat_id)
                else:
                    send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
            else:
                send_message("Not a valid command. Please use /help to check for valid commands", chat_id)
        else:
            send_message("Only text commands are allowed. Please use /help to check for valid commands", chat_id)
        readed += 1
