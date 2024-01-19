import random,math
from time import time

def lisEmba(inscritos, seed = 0):
    
    if seed == 0:
        seed = str(time()).split('.')
        random.seed(int(seed[1]))
        sai = True
    else:
        random.seed(seed)
        sai = False

    consumida = list()
    resultado = list()

    for i in range(inscritos):
        consumida.insert(i, i+1)
        resultado.insert(i, 0)
    
    for i in range(inscritos):
        aleatorio = math.floor(random.random()*inscritos)
        
        while consumida[aleatorio] == 0:
            aleatorio = (1+aleatorio)%inscritos
        
        resultado[i] = consumida[aleatorio]
        consumida[aleatorio] = 0

    return resultado,seed[1] if sai else seed

def main(num_de_inscr, seed = 0):
    lista,semente = lisEmba(num_de_inscr, seed)
    for i in range (len(lista)):
        lista[i] = lista[i]-1
    return lista, semente
    '''print(f"""A ordem do sorteio é:
{lista}
com a semente de randomização: {semente}""")'''

#main(5, 12345)