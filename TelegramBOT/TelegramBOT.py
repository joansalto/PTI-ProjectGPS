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
import multiprocessing as mp
import time

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
    if (len(row) > 0): return [-1,-1]
    cursor.execute("SELECT ID,Nombre,Apellido from ClientData WHERE DNI=%s AND ID=%s", (DNI, ID))
    row = cursor.fetchall()
    if len(row) != 0:
        return [1, row[0][1], row[0][2]]
    else:
        return [0,0]


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


def check_contract(connection2, cursor2, person):
    cursor2.execute(
        "SELECT * FROM CarData WHERE idCliente = %s AND ID = (SELECT MAX(ID) FROM CarData WHERE idCliente = %s)",
        (person[1], person[1]))

    row = cursor2.fetchone()
    connection2.commit()
    cursor2.execute(
        "SELECT Distance FROM CarData WHERE idCliente = %s AND ID = (SELECT MIN(ID) FROM CarData WHERE idCliente = %s)",
        (person[1], person[1]))
    distance_min = cursor2.fetchall()
    distance_min = distance_min[0][0]
    connection2.commit()
    cursor2.execute("SELECT MaxKM FROM ClientData WHERE ID = %s",(person[1],))
    MaxKM = cursor2.fetchall()
    MaxKM = MaxKM[0][0]
    connection2.commit()
    if len(row) != 0:
        speed = row[4]
        fuel = row[5]
        pos_x = row[8]
        pos_y = row[9]
        rpm = row[3]
        ID = row[0]
        distance = row[7]
        dangers = []
        # adjust paramaters advising here!!!!!!!!!!!!!!!!!!!!!!!
        if speed > 120:
            if speed > 140:
                dangers.append("ext_speed")
            else:
                dangers.append("speed")
        else:
            dangers.append("none")

        if rpm >= 2000:
            if rpm > 2500:
                dangers.append("ext_rpm")
            else:
                dangers.append("rpm")
        else:
            dangers.append("none")

        if fuel < 15:
            if fuel < 5:
                dangers.append("ext_fuel")
            else:
                dangers.append("fuel")
        else:
            dangers.append("none")
        if (distance-distance_min) >= (MaxKM*1000*90)/100:
            if (distance-distance_min)>= (MaxKM*1000):
                dangers.append("ext_dis")
            else:
                dangers.appends("dis")
        else:
            dangers.append("none")
        dangers.append(ID)
        return dangers
    return ["none", "none", "none"]


def checker():
    connection2 = mdb.connect(user='root', password='CarLocator',
                              host='carlocator.cshcpypejvib.us-west-2.rds.amazonaws.com', database='CarLocator')
    cursor2 = connection2.cursor()
    checked_list = {}
    while 1:
        cursor2.execute("SELECT * FROM TelegramBOT")

        registreds = cursor2.fetchall()
        connection2.commit()
        for person in registreds:
            checks = check_contract(connection2, cursor2, person)
            if checks != 3:
                if person[1] in checked_list and checked_list[person[1]] != checks[-1]:
                    send_message_if_danger(checks, person)
                    checked_list[person[1]] = checks[-1]
                elif person[1] not in checked_list:
                    send_message_if_danger(checks, person)
                    checked_list[person[1]] = checks[-1]
        time.sleep(9.5)


def send_message_if_danger(checks, person):
    if checks[0] == "ext_speed":
        send_message("La velocidad és excesivamente alta!", person[3])
    elif checks[0] == "speed":
        send_message("Por favor modere la velocidad esta viajando demasiado rapido", person[3])
    if checks[1] == "ext_rpm":
        send_message("Por favor canvie de marcha esta revolucionando en exceso el motor", person[3])
    elif checks[1] == "rpm":
        send_message("Esta accelerando ligeramente el motor", person[3])
    if checks[2] == "ext_fuel":
        send_message("Pongase de camino a una gasolinera cercana de forma urgente", person[3])
    elif checks[2] == "fuel":
        send_message("Vigile el deposito del coche", person[3])
    if checks[3] == "ext_dis":
        send_message("Ha excedido la distancia màxima que puede recorrer porfavor pare inmediatamente cuando pueda", person[3])
    elif checks[3] == "dis":
        send_message("Le queda menos de un 10% de distancia que puede recorrer", person[3])


# MAIN
if __name__ == '__main__':
    connection = mdb.connect(user='root', password='CarLocator',
                             host='carlocator.cshcpypejvib.us-west-2.rds.amazonaws.com', database='CarLocator')
    cursor = connection.cursor()
    mp.set_start_method('spawn')
    p = mp.Process(target=checker)
    p.start()
    while 1:
        messages = get_updates(readed)
        if len(messages["result"]) > 0:
            readed = messages["result"][0]["update_id"]

        for message in messages["result"]:
            if "message" in message:
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
                                status2 = check_telegram(cursor, chat_id)
                                if status[0] == 1 and status2 == 0:
                                    register_database(connection, cursor, DNI, ID, chat_id)
                                    send_message(
                                        "{} {} ha activado las notificaciones. Bienvenido al servicio de telegram de CarLocator".format(
                                            status[1], status[2]),
                                        chat_id)
                                elif status[0] == -1:
                                    send_message("Ya estavan activadas las notificaciones", chat_id)
                                elif status2 == 1:
                                    send_message("Este movil ya tiene un DNI asociado, desasocielo primero por favor",
                                                 chat_id)
                                else:
                                    send_message("Cliente no valido por favor verifique la informacion subministrada",
                                                 chat_id)
                            else:
                                send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                             chat_id)
                        else:
                            send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                         chat_id)
                    elif len(message["message"]["text"]) == 6:
                        if message["message"]["text"][0:6] == "/start":
                            send_message(
                                "Bienvenido a CarLocatorBOT\nPuede usar /register DNI ID para habilitar el recivir informacion \nPuede usar /unregister para desactivar el recivir informacion",
                                chat_id)
                        else:
                            send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                         chat_id)
                    elif len(message["message"]["text"]) == 5:
                        if message["message"]["text"][0:5] == "/help":
                            send_message(
                                "Bienvenido a CarLocatorBOT\nPuede usar /register DNI ID para habilitar el recivir informacion \nPuede usar /unregister para desactivar el recivir informacion",
                                chat_id)
                        elif message["message"]["text"][0:5] == "/bobi":
                            send_message(
                                "Lamentamos las molestias pero se ha equivocado de proyecto, yo no le voy a recordar donde guarda las cosas.",
                                chat_id)
                        else:
                            send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                         chat_id)
                    elif len(message["message"]["text"]) == 11:
                        if message["message"]["text"][0:12] == "/unregister":
                            if check_telegram(cursor, chat_id):
                                unregister_database(connection, cursor, chat_id)
                                send_message("Ha desactivado las notificaciones",
                                             chat_id)
                            else:
                                send_message("Las notificaciones ya estavan desactivadas para este movil", chat_id)
                        else:
                            send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                         chat_id)
                    else:
                        send_message("Comando no valiod. Por favor use /help para mirar los comandos validos", chat_id)
                else:
                    send_message("Comando no valiod. Por favor use /help para mirar los comandos validos",
                                 chat_id)
            readed += 1
