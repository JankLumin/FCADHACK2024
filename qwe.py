import json


def extract_keys(obj, keys_set):
    if isinstance(obj, dict):
        for key, value in obj.items():
            keys_set.add(key)
            extract_keys(value, keys_set)
    elif isinstance(obj, list):
        for item in obj:
            extract_keys(item, keys_set)


if __name__ == "__main__":
    keys_set = set()
    with open("data.json", "r", encoding="utf-8") as file:
        content = file.read()
        try:
            data = json.loads("[" + content.replace("}\n{", "},\n{") + "]")
            extract_keys(data, keys_set)
            print(keys_set)
        except json.JSONDecodeError as e:
            print("Ошибка декодирования JSON:", e)
