# Backend API

Il backend è stato sviluppato usando tre framework: FastAPI, Pydantic e SQLAlchemy.

**FastAPI**

FastAPI è un framework per la costruzione di API RESTful con Python.
È basato su standard come OpenAPI e JSON Schema.
È progettato per sfruttare la tipizzazione statica di Python.
Incorpora una gestione automatica della documentazione, e la validazione dei dati grazie all'uso di Pydantic.
Supporta pienamente funzionalità asincrone (`async`/`await`) permettendo una gestione efficiente delle richieste I/O-bound.

**Pydantic**

Pydantic è una libreria per la validazione dei dati e la gestione delle tipizzazioni basata sui tipi standard di Python.
Utilizza annotazioni di tipo per dichiarare i modelli dei dati e valida automaticamente i dati in ingresso (ad es. dati JSON in una richiesta HTTP) e  i dati di output in uscita.

**SQLAlchemy**

SQLAlchemy è una libreria SQL toolkit e ORM (Object Relational Mapper) per Python.
Fornisce un sistema per mappare le classi Python alle tabelle di un database.

## Deployment

Il file `requirements.txt` contiene la lista dei moduli python che verranno installati all'interno dell'immagine, e le specifiche sulle versioni necessarie.

Il file `backend/app/main.py` copre le configurazioni inerenti a FastAPI, come le CORS policy.

## App

La parte principale dell'applicativo resta nella cartella `backend/app/src`, così strutturata:

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

  - `maskable` è un wrapper che valuta il ruolo di chi ha lanciato la richiesta HTTP, e cifra o meno un parametro selezionato (di default il `patient_id`).

  - `hue` genera un hash univoco di dimensione arbitraria per un deteminato valore / ID (di default il `patient_id`).

## Open API

FastAPI implementa nativamente le specifiche Open API.
Possono essere raggiunte su `https://my.backend.domain/api/v1/openapi.json`, oppure tramite Swagger UI su `https://my.backend.domain/docs/`:

<img src="../../images/swagger.png" width=700 />

Per tutti gli endpoint sono documentati i parametri del corpo sia della richiesta che della risposta:

<img src="../../images/api_specifics.png" width=700 />

Per utilizzare la demo, è sufficiente autenticarsi cliccando sul pulsante ***"Authorize"*** usando le credenziale di un qualsiasi utente e client.
