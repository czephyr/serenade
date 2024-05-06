# TODO

## dbpercona
- [ ] logica `ON DELETE`
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`

## backend
- sanificazione
  - [ ] Invalid base64-encoded string
  - [ ] crud create: controlla che _id esista ForeingConstraint
  - [ ] contraints su date_
  - [ ] da datetime a date
- [ ] 484 su `keycloak_openid.introspect`
- [ ] allunga nomi funzioni endpoint (così si specchiano)
- [ ] "=" escaper | no_need_to_escape: 32 (2\**5), 128(2\**7), 512(2\**9), 2048(2\**11), bit RN

## keycloak
- [ ] SSL
- [ ] ruoli e client secrets per tutti
  - unimi
  - admin

## frontend
- [ ] redirect account details `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/account/`
- [ ] When user is not logged, it needs to be redirected to home, not go in error
- [ ] explicit says 401 instead of "Sorry, an error happened. Check the server logs."
  - and force logout

## frontend - UI
- [ ] In installation detail, a button to open and to close the installation, so that start and end get populated. Also they need to be moved up on the installation detail component and put on the same line
- [ ] Nella creazione del paziente serve una tickbox che se tickata imposta la join date a "adessp", se no la si inserisce (endpoint join)
- [ ] Nella pagina del paziente si puo' editare la join date e la closing date (enpoint exit)

## altro
- [ ] dischi persistenti nel dockerfile + dargli un nome
- [ ] togliere volumi montati nei compose

```sql
sqlalchemy.exc.IntegrityError: (psycopg.errors.ForeignKeyViolation) insert or update on table "ticket_messages" violates foreign key constraint "ticket_messages_ticket_id_fkey"
DETAIL:  Key (ticket_id)=(7) is not present in table "tickets".
[SQL: INSERT INTO ticket_messages (ts, sender, body, ticket_id) VALUES (%(ts)s::TIMESTAMP WITHOUT TIME ZONE, %(sender)s::VARCHAR, %(body)s::VARCHAR, %(ticket_id)s::INTEGER) RETURNING ticket_messages.id]
```

- [ ] questo quando non sono get su patient????
- [ ] brutta la empty nella many se _id non esiste
