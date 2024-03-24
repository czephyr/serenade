# TODO

- [ ] logica `ON DELETE` (fittizia, tipo `date_end` `NULL`)
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`
- [ ] inverso di `validate_model` non solleva errori, conrolla che lo faccia in debug mode off
- [ ] ticket visibile anche da `installations/{i_no}/tickets`
  - [ ] ma anche tutti gli altri `endpoint` (con swagger ??)
- [ ] (?????????) usare async / await per davvero:
  - <https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html#engine-api-documentation>
  - <https://fastapi.tiangolo.com/async/>
- [ ] aggiungere `title` alla entità ticket
- [ ] (!?) `creation_date` su ogni entità
- [ ] chiedere esplicitamente nell'API con che tipo di ruolo si vuole accedere ai dati (ruolo misto IIT IMT)
- [ ] pensare se è una buona idea mettere `OggettoCrete` come classe padre di `OggettoBase`
  - vantaggio: puoi usare `model_dump` nella `create()`
- [ ] Dockerfile per il backend
