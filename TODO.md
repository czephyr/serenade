# TODO

## dbpercona
- [ ] logica `ON DELETE`
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`

## backend
- [ ] 484 su `keycloak_openid.introspect`
- [ ] allunga nomi funzioni endpoint (così si specchiano)
- [ ] "=" escaper | no_need_to_escape: 32 (2\**5), 128(2\**7), 512(2\**9), 2048(2\**11), bit RN
- [ ] brutta la empty nella many se _id non esiste (glissabile)

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
- [ ] Adding contacts needs a backend call when you delete or add, to update the list of contacts
- [ ] Editing a field needs a backend call to a PUT api which edits the field that has been edited
- [ ] Fields which are select need to be selects instead of strings

## frontend - UI
- [ ] Nella creazione del paziente serve una tickbox che se tickata imposta la join date a "adessp", se no la si inserisce (endpoint join)
- [ ] Nella pagina del paziente si puo' editare la join date e la closing date (enpoint exit)

## altro
- [ ] dischi persistenti nel dockerfile + dargli un nome
- [ ] togliere volumi montati nei compose
