import json
import multiprocessing
from functools import partial
import re
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS  # Импортируем Flask-CORS

number_of_cores = 12
ENDPOINT = "http://127.0.0.1:8000/api/admin-panel/upload-user-data/"

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех доменов и методов


class Proxy:
    def __init__(self, backend_endpoint):
        self.backend_endpoint = backend_endpoint

    def process_message(self, message):
        message = message.strip("[").strip("]")
        fields_to_hide = message.split(", ")
        lines = self.read_file()

        dictionaries = self.create_dictionaries(lines)
        for i in dictionaries:
            for j in fields_to_hide:
                if j in i:
                    i[j] = "***"
        # Обработка поля message
        for i in dictionaries:
            i["Message"] = self.change_message(i["Message"], fields_to_hide)

        result = self.create_json(dictionaries)
        return "[\n" + ",\n".join(result) + "\n]"

    def send_to_back(self, message):
        """
        Отправляет обработанное сообщение на бек
        """
        try:
            time.sleep(1)

            headers = {
                "Content-Type": "application/json",
                "X-Proxy-Auth": "V%U<UwFo[#V/,l<$9plp]KE[6@=tU^pDdP|<2<G<C;V/{=Til9~!L|Gs2i*4",  # Удалён заголовок аутентификации
            }

            response = requests.post(
                self.backend_endpoint, data=message.encode("utf-8"), headers=headers
            )

            return response  # Возвращаем объект ответа
        except Exception as e:
            print(f"Ошибка при отправке запроса на бекенд: {e}")
            return None

    def read_file(self):
        with open("data.log", "r", encoding="utf-8") as file:
            lines = file.readlines()
            lines = list(i.strip("\n") for i in lines)
            return lines

    def change_message(self, message, fields_to_hide):
        for i in fields_to_hide:
            if i in ("Фамилия", "Имя", "Отчество", "Пол", "Дата рождения"):
                message = self.replace_FIO(message)
            if i in (
                "Адрес прописки",
                "Страна",
                "Регион",
                "Город",
                "Улица",
                "Номер дома",
            ):
                message = self.replace_Adress(message)
            if i in ("Серия и номер паспорта", "Код подразделения", "Кем выдан"):
                message = self.replace_Pasport(message)
            if i in ("Логин", "Пароль"):
                message = self.replace_LoginPassword(message)
            if i in (
                "номер счета",
                "Имя владельца карты",
                "Номер кредитной карты",
                "Срок действия карты",
            ):
                message = self.replace_Card(message)
            if i in (
                "Специальность",
                "Направление",
                "Учебное заведение",
                "Серия/Номер диплома",
                "Регистрационный номер",
            ):
                message = self.replace_University(message)

        return message

    def create_dictionaries(self, lines):
        return parallel_load_json(lines)

    def create_json(self, dictionaries):
        with multiprocessing.Pool(processes=4) as pool:
            # Создаем частичную функцию для json.dumps
            dump_with_options = partial(json.dumps, ensure_ascii=False)
            result = pool.map(dump_with_options, dictionaries)
        return result

    def replace_data(self, text, pattern):
        def repl(match):
            return (
                match.group(1)
                + "*" * (len(match.group(0)) - len(match.group(1)) - 1)
                + "\n"
            )

        result = re.sub(pattern, repl, text)
        return result

    def replace_FIO(self, text):
        pattern = (
            r"((Фамилия|Имя|Отчество|Пол|Дата рождения)\s*(?:\:|\=|\s{2})\s*).*?\n"
        )
        return self.replace_data(text, pattern)

    def replace_Adress(self, text):
        pattern = r"((Адрес прописки|Страна|Регион|Город|Улица|Номер дома)\s*(?:\:|\=|\s{2})\s*).*?\n"
        return self.replace_data(text, pattern)

    def replace_Pasport(self, text):
        pattern = r"((Серия и номер паспорта|Код подразделения|Кем выдан)\s*(?:\:|\=|\s{2})\s*).*?\n"
        return self.replace_data(text, pattern)

    def replace_LoginPassword(self, text):
        pattern = r"((Логин|Пароль)\s*(?:\:|\=|\s{2})\s*).*?\n"
        return self.replace_data(text, pattern)

    def replace_Card(self, text):
        pattern = r"((номер счета|Имя владельца карты|Номер кредитной карты|Срок действия карты)\s*(?:\:|\=|\s{2})\s*).*?\n"
        return self.replace_data(text, pattern)

    def replace_University(self, text):
        pattern = r"((Специальность|Направление|Учебное заведение|Серия/Номер диплома|Регистрационный номер)\s*(?:\:|\=|\s{2})\s*).*?\n"
        return self.replace_data(text, pattern)


def parallel_load_json(lines):
    with multiprocessing.Pool(processes=number_of_cores) as pool:
        dictionaries = pool.map(load_json, lines)
        return dictionaries


def load_json(line):
    return json.loads(line)


def create_parallel_json(dictionaries):
    with multiprocessing.Pool(processes=number_of_cores) as pool:
        result = pool.map(load_json, dictionaries)
        return dictionaries


def create_json(dictionary):
    return json.dumps(dictionary, ensure_ascii=False)


proxy = Proxy(ENDPOINT)


@app.route("/upload", methods=["POST"])
def upload():
    try:
        # Предполагается, что данные приходят в виде JSON или простой строки
        if request.is_json:
            data = request.get_json()
            message = json.dumps(data, ensure_ascii=False)
        else:
            message = request.get_data(as_text=True)

        print(f"Получено сообщение от frontend: {message}")

        # Обработка сообщения
        processed_message = proxy.process_message(message)
        print(f"Обработанное сообщение: {processed_message}")

        # Отправка на бэкенд
        response = proxy.send_to_back(processed_message)

        if response is None:
            return (
                jsonify(
                    {"status": "error", "message": "Ошибка при отправке на бэкенд"}
                ),
                500,
            )

        # Прокси-сервер будет передавать ответ бэкенда клиенту
        try:
            backend_response = response.json()
        except ValueError:
            backend_response = response.text

        return (
            jsonify(
                {
                    "status": "success" if response.status_code == 201 else "error",
                    "backend_status": response.status_code,
                    "backend_response": backend_response,
                }
            ),
            response.status_code,
        )

    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    # Запуск Flask-сервера
    app.run(host="127.0.0.1", port=8080)
