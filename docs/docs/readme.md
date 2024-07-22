# Serenade

Questa piattaforma è sviluppata come progetto Docker Compose. I servizi sviluppati sono:

- `traefik` come reverse proxy per il progetto
- `dbpercona` per la base dati della piattaforma
- `keycloak` per la gestione degli utenti
- `backend` per la logica delle API per interagire con i dati.
- `frontend` per la logica di visualizzazione e interazione con le API.

A lato, due servizi complementari:

- `dbkeycloak` per il salvataggio dinamico delle informazioni sugli utenti
- `documentation` per la documentazione di questo progetto

Ogni componente della piattaforma è un servizio autonomo, che può essere avviato su macchine distinte (portability).
Le specifiche per la creazione della ***immagine*** dei singoli servizi (variabili d'ambiente, files da copiare, moduli da installare, ecc..) vengno cariate tramite il rispettivo `Dockerfile` o direttamente nel file `docker-compose.yml`.

Nella cartella `.envars` ogni servizio può ritrovare le variabili d'ambiente necessarie per l'esecuzione.
