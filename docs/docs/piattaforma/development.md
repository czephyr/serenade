## Consigli di development

Estendere la piattaforma richiede una buona conoscenza di OAuth, Docker e Docker compose, NextJS, FastAPI, SQL e MkDocs.

Si consiglia di lavorare sul branch `dev` e poi una volta testato il codice di mergiare ad un branch di produzione.

Per lavorare in un ambiente `development` basta clonare la repository del progetto e avviare il comando `docker compose up`.

Cambiamenti locali al sistema di backend richiedono di riavviare il container che ospita il backend. 

Cambiamenti locali al sistema di frontend vengono renderizzati automaticamente senza dover riavviare il container grazie al binding dei volumi; per far si che questo avvenga assicurarsi che l'ENTRYPOINT dell'img sia in modalita' `run dev`. Anche la documentazione basata su MkDocs renderizza i cambi automaticamente utilizzando gli stessi principi.