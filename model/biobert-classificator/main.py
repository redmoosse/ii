from model import BioModel

def main():
    bio_model = BioModel()
    
    # Ввод строки от пользователя
    query = input("Введите медицинский запрос: ")

    # Получение результата
    result = bio_model.process(query)

    # Вывод результата
    print("Результат классификации:")
    print(f"Направление: {result['direction']}")
    print(f"Специалист: {result['specialist']}")

if __name__ == "__main__":
    main()