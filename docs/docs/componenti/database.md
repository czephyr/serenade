# Database

Il DBMS utilizzato per gestire i dati della piattaforma è una versione di Postgres estesa da Percola Lab.
In questa versione è implementata una estension che aggiunge la funzionalità di Transparent Data Encryption (TDE).
Più dettagli sulla [repo ufficiale](https://github.com/Percona-Lab/pg_tde).

Nella cartella `dbpercona` possono essere trovati due file:

- `pg-xx-init.sql` che contiene il DDL della piattaforma.
- `pg-xx-ppopulate.sql` che continene data fittizi di esempio.

Entrambi i file vengono caricati al primo avvio tramite il binding del volume specificato nel `docker-compose.yml`:

```yaml
dbpercona:
  volumes:
    - ./dbpercona/pg-xx-init.sql:/docker-entrypoint-initdb.d/pg-xx-init.sql
    - ./dbpercona/pg-xx-populate.sql:/docker-entrypoint-initdb.d/pg-xx-populate.sql
```
