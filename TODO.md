# TODO

- [ ] logica `ON DELETE` (fittizia, tipo `date_end` `NULL`)
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`
- [ ] inverso di `validate_model` non solleva errori, conrolla che lo faccia in debug mode off
- [ ] ticket visibile anche da `installations/{i_no}/tickets`
  - [X] ma anche tutti gli altri `endpoint` (con swagger ??)
- [X] (?????????) usare async / await per davvero:
  - <https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html#engine-api-documentation>
  - <https://fastapi.tiangolo.com/async/>
- [ ] aggiungere `title` alla entità ticket
- [X] (!?) `creation_date` su ogni entità
- [ ] chiedere esplicitamente nell'API con che tipo di ruolo si vuole accedere ai dati (ruolo misto IIT IMT)
- [X] pensare se è una buona idea mettere `OggettoCrete` come classe padre di `OggettoBase`
  - vantaggio: puoi usare `model_dump` nella `create()`
- [X] Dockerfile per il backend

- [ ] env file con:
  - KEYCLOAK_URL
  - KEYCLOAK_REALM
  - KEYCLOAK_CLIENT_ID
  - KEYCLOAK_CLIENT_SECRET
  - KEYCLOAK_PUBLIC_KEY
- [X] gitignore js / node / react
- [X] auto swagger api controlla

- [ ] 484 su keycloak_openid.introspect
- [X] data_inizio e data_fine
- [X] file multipli
- [ ] filtro per ruolo
- [ ] wrapper mascherare patient_id
- [ ] mappa aliases
- [X] update nullable
- [ ] wrapper 404
- [ ] patient PUT
- [ ] solleva LOCKED su open/close invalido
- [ ] allunga nomi endpoint

