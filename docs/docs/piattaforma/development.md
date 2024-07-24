# Development

Per poter estendere lo sviluppo della piattaforma è necessaria una discreta conoscenza di:

- git
- Docker e Traefik
- Keycloak e OpenID-Connect
- Javascript con NextJS
- Python con FastAPI e SQLAlchemy

Il progetto è versionato con `git`.
Si consiglia di usare `dev` come branch di lavoro, e usare invece `area-51` per il deployment di produzione.
Quando le modifiche in `dev` sono state testate con successo, è possibile aggiornare `area-51` con una [Merge Request](https://docs.gitlab.com/ee/user/project/merge_requests/) o una operazione di `git merge`.

## Development in locale

Per lavorare in un ambiente di development locale:

- `git clone` di questo progetto
- Accedere alla directory del progetto
- `git checkout` su `dev` o un qualsiasi altro branch di development
- Inserire nel file `hosts` (`/etc/hosts` per Unix, `C:\Windows\System32\drivers\etc\hosts` per Windows) **i nomi dei servizi (`container_name`) registrati nel file** `docker-compose.yml`, per esempio:

```ps1
127.0.0.1 keycloak
127.0.0.1 backend
127.0.0.1 frontend
127.0.0.1 mkdocs
```

- Modificare in parallelo il file `.env`:

```sh
KEYCLOAK_HOSTNAME="keycloak"
BACKEND_HOSTNAME="backend"
FRONTEND_HOSTNAME="frontend"
DOCS_HOSTNAME="mkdocs"
```

- `docker compose up --build` per avviare.

Ora puoi accedere ai componenti con `http://nome_servizio/`, ad esempio `http://frontend/`

### Hot reload

È necessario ravviare il container che ospita `backend` per poter applicare le modifiche effettuate.

Invece i servizi `frontend` e `docs` supportano l'**hot reload**: i cambiamenti al codice vengono applicati automaticamente senza riavviare il container.
È comunque necessario specificare il *binding dei volumi* nel file `docker-compose.yml`, ad esempio:

```yml
volumes:
    - ./frontend/src/components:/src/components
```

Assicurarsi che l'`ENTRYPOINT` dell'immagine sia in modalità `run dev`.

#### DDL

Se non è necessario effettuare migrazioni di dati, è possibile applicare modifiche al DDL eliminando il container che ospita il database (`dbpercona`) e i volumi ad essso collegati (a.e. `docker rm dbpercona -v`).
Viceversa la migrazione va effettuata manualmente con query di DML, o avvalendosi di SQLAlchemy.
