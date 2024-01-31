#módulos
import json , os 
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

#função interna
from api.sorteador import read

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5501","http://127.0.0.1:5501/site/index.html","http://localhost:5501","file:///C:/Users/Usuario/Documents/Sketchs_Front/sample/meu_sorteio/index.html","file:///C:/Users/Usuario/Documents/Sorteador-Cvti/Sorteador-de-Cursos-do-CVTI/site/index.html"],
    allow_credentials=True,
    allow_methods=["*"],  # ou específicos como ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],  # ou específicos como ["Authorization", "Content-Type"]
)



#main
@app.get("/{turma}&{semente}")
async def main(turma: str, semente: int):
    ppi_lista = []
    amp_lista = []

    # Verifica se a turma existe
    existe = os.path.isfile(f'api/dbase/{turma}_cota.csv') and os.path.isfile(f'api/dbase/{turma}_ampla.csv')
    if not existe:
        raise HTTPException(status_code=404, detail="Turma não encontrada")

    # Leitura dos arquivos
    frame_cota = pd.read_csv(f'api/dbase/{turma}_cota.csv')
    frame_ampla = pd.read_csv(f'api/dbase/{turma}_ampla.csv')

    # PPI
    sorteado_ppi, seed_ppi = read(len(frame_cota), semente)

    for num in range(5):
        ppi_lista.append({'nome': frame_cota['Nome'][sorteado_ppi[num]], 'CPF': frame_cota['CPF'][sorteado_ppi[num]]})

    ppi_lista = pd.DataFrame(ppi_lista)

    for j in range(len(ppi_lista)):
        for i in range(len(frame_ampla)):
            try:
                if frame_ampla['Nome'][i] == ppi_lista['Nome'][j]:
                    frame_ampla = frame_ampla.drop(i, axis=0)
            except KeyError:
                pass

    # Ampla
    sorteado_ampla, seed_ampla = read(len(frame_ampla), semente)

    i = 0
    vaga = 25
    while i < vaga:
        try:
            amp_lista.append({'nome': frame_ampla['Nome'][sorteado_ampla[i]], 'CPF': frame_ampla['CPF'][sorteado_ampla[i]]})
        except KeyError:
            vaga += 1
            pass
        i += 1

    amp_lista = pd.DataFrame(amp_lista)

    # Consolidador e post
    frame_sorteado = pd.concat([ppi_lista, amp_lista], ignore_index=True)

    frame_sorteado.to_csv(f'api/results/{turma}_sorteado.csv', index=False)
    frame_sorteado.to_json(f'api/results/{turma}_sorteado.json', indent=4, orient='table', index=False)

    with open(f'api/results/{turma}_sorteado.json', "r") as trans:
        val = json.load(trans)

    val["schema"].update({"semente": semente})

    with open(f'api/results/{turma}_sorteado.json', "w", encoding='utf-8') as trans:
        json.dump(val, trans, indent='\t', ensure_ascii=False)

    return val


app.mount("/", StaticFiles(directory="site", html = True), name="site")