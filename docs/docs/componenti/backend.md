# Backend API

## Deployment

L'app per il backend è svilupppata all'interno di un progetto docker.
Le specifiche per la creazione della relativa immagine sono nel file ``

## App

Il file `backend/app/main.py` copre le configurazioni inerenti a FastAPI, come le CORS policy.
La parte principale dell'applicativo è nella cartella `backend/app/src`, così strutturata:

```bash
src
├── api
│   ├── deps.py
│   ├── endpoints
│   │   ├── ...
│   │   └── patients.py
├── core
│   ├── config.py
│   ├── const.py
│   ├── crypto.py
│   ├── excp.py
│   ├── roles.py
│   └── status.py
├── crud
│   ├── ...
│   └── patients.py
├── dbsession.py
├── ormodels.py
├── schemas
│   ├── ...
│   └── patient.py
└── utils.py
```

- Il file `ormodels.py` contiene i modelli delle entità per come sono strutturati nel database relazionale.

- La cartella `schemas` contiene invece i modelli delle entità per come verranno presentati dagli endpoint finali.
Ad esempio `schemas/patient.py` contiene `PatientUpdate`, il modello dati atteso per aggiornare un paziente.

- La cartella `api/endpoints` contiente la logica di esposizione delle singole entità.
Ad esempio, il file `api/endpoints/patients.py` conterrà i metodi che possono essere eseguiti sull'entità `patients` (`GET`, `PUT`, ecc..) e la gestione di possibili errori nella richiesta HTTP.

- La cartella `api/crud` contiente la logica di estrazione dati dal database delle singole entità.
Ad esempio, il file `api/crud/patients.py` conterrà i metodi per interrogare e modellare i dati in modo da forgiare una lista per rispondere a una richiesta HTTP `GET /patients`.

- La cartella `api/endpoints/core` contiente costanti o configurazioni inerenti all'applicazione
In particolare il file `api/endpoints/core/crypto.py` contiene i metodi che caricano i parametri dei protocolli crittografici e le applicano in base al contesto di utilizzo, in particolare:

  - `maskable` è un wrapper che valuta il ruolo di chi ha lanciato la richiesta HTTP, e cifra o meno un parametro selezionato.

  - `hue` genera un hash univoco di dimensione arbitraria per un deteminato valore / ID
