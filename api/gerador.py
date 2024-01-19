import csv
from faker import Faker

fake = Faker('pt_BR')
cursos = ['Apps','Robótica','Programação']

data = []
for i in cursos:
    data = []
    for _ in range(90):
        nome = fake.first_name()
        sobrenome = fake.last_name()
        cpf = fake.unique.random_number(digits=11)
        data.append([nome + ' ' + sobrenome, cpf])
    with open(f'dbase/{i}.csv', 'w', newline='',encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Nome','CPF'])
        for i in data:
            writer.writerow(i)
