# Sorteador de Cursos do CVTI

#### Esse software foi desenvolvido usando outro projeto como base usando como base um projeto do IFSC: https://github.com/idcesares/Sistema-de-Sorteio

## Rodando o projeto

### Crie um ambiente virtual env para o python

```bash
python -m venv .venv
```

### Entre no ambiente virtual com:

No Windows

```bash
.venv\Scripts\activate
```

No Linux

```
source .venv/bin/activate
```

### Instale as dependências com:

```bash
python -m pip install -r requirements.txt
```

### Rode o Servidor

```bash
python -m uvicorn api.api_v2:app --reload
```

### Vendo o projeto

Abra o navegador e entre em http://127.0.0.1:8000/

## Front- end 🖥️

Um dos objetivos foi criar um visual personalizado que atendesse ao CVTI, ficando com um visual assim:

<div align="center">
  
![image](https://github.com/jo4o0rn3ll4s/Sorteador-de-Cursos-do-CVTI/assets/65920201/285ffb22-736d-41b1-8374-743c825b4e47)

</div>

Quando preenchido e sorteado, a lista dos nomes aparece da seguinte forma:

<div align="center">
  
![image](https://github.com/jo4o0rn3ll4s/Sorteador-de-Cursos-do-CVTI/assets/65920201/0a644ba2-0127-4ad1-8487-a08bea50642b)

</div>

Tais dados estão sendo passados para o front utilizando do `axios`(https://axios-http.com/ptbr/docs/intro), ferramenta responsavel para utilização de API's.

---

Por conveniencia, caso seja lido o código fonte, pode-se observar que a parte de geração da semente está sobre responsabilidade do `javascript`. Tal código, é herança do projeto mencionado a cima.

---

## Back- end ⚙️

Esse projeto teve como motivação a dificuldade de fazer o sorteio da forma que precisavamos e obter os resultados de uma forma mais pratica, visto isso, desenvolvi uma API em `python` para determinada necessidade. O programa utiliza dos seguintes módulos:

que necessitam ser instalados através do comando `pip` em seu terminal

- `pandas`(https://pandas.pydata.org/docs/),
- `fastAPI`(https://fastapi.tiangolo.com/)

e a biblioteca padrão:

- `json`(https://jsons.readthedocs.io/en/latest/)

Quando requisitado a API, ela devolve os dados da seguinte forma:

<div align="center">
  
![image](https://github.com/jo4o0rn3ll4s/Sorteador-de-Cursos-do-CVTI/assets/65920201/a55effe6-1b97-4cea-8596-059c0cddea78)

</div>

(note que esta é a resposta que foi enviada quando o site apresentou o resultado acima do sorteio)
\
\
Além de tal devolução, o programa por si já salva tal lista de sorteados em `.csv`, extenção essa que precisamos para converter tal em uma planilha excel de forma mais facil e rápida, assim facilitando o trabalho de nosso analista de dados.

## Segurança dos dados 🗃️

Quando comecei tal projeto utilizei, para meus testes, poucos nomes, escrevi manualmente uns 10 nomes e 10 numeros quaisquer como 'cpf' dessas fulanos de teste. Quando fui testar com um numero maior de dados, enfrentei problemas para criar mais, daria muito trabalho escever mais de 100 nomes e numeros pra testar... Assim, peguei uma basa de dados antiga de inscritos, mas OBVIAMENTE, eu n poderia publicar assim aqui no github.
\
\
Por isso, fui atrás e encontrei o módulo `faker`(https://faker.readthedocs.io/en/master/). Tal módulo está sendo utilizado no programa `gerador.py`, onde com algumas pequenas alterações é possivel mudar o numero de arquivos que você deseja gerar, com quais nomes, e que dados deve conter. Dessa forma consegui fazer a base de dados com uma boa quantidade de numeros e em pouco tempo.

<div align="center">
  
![image](https://github.com/jo4o0rn3ll4s/Sorteador-de-Cursos-do-CVTI/assets/65920201/91844a4e-578e-48ec-b51b-7604219f7d6c)

</div>
