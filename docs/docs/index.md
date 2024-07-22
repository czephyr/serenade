# Serenade

Questa piattaforma è sviluppata come progetto Docker Compose.
Ogni componente della piattaforma è un servizio autonomo, che può essere avviato su macchine distinte (portability).
Le specifiche per la creazione della ***immagine*** dei singoli servizi (variabili d'ambiente, files da copiare, moduli da installare, ecc..) vengno cariate tramite il rispettivo `Dockerfile` o direttamente nel file `docker-compose.yml`.

Nella cartella `.envars` ogni servizio può ritrovare le variabili d'ambiente necessarie per l'esecuzione.
