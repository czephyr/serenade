# TODO

## dbpercona
- [ ] chiave per crittografare
- [ ] logica `ON DELETE`
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`

## backend
- [ ] 484 su `keycloak_openid.introspect`
- [ ] allunga nomi funzioni endpoint (così si specchiano)
- [ ] dataset diverso da arlecchino
- [ ] BIGINT sqlachemy
- [X] check CF before CREATE
- [ ] Remove duplicate CF constraint
- [ ] crud create: controlla che _id esista ForeingConstraint
- [ ] contraints su date_
- [ ] da datetime a date

## keycloak
- [ ] SSL
- [ ] gruppo admin

## frontend
- [ ] Nei dettagli paziente, il tasto per seguire alle dashboards anche nei dettagli `{DASHBOARD_SERVER_URL}?pid={patient_id}`
- redirects
  - [ ] sign up `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/login-actions/registration`
  - [ ] account details `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/account/`
- [ ] When user is not logged, it needs to be redirected to home, not go in error

## frontend - UI
- [ ] In installation detail, a button to open and to close the installation, so that start and end get populated. Also they need to be moved up on the installation detail component and put on the same line
- [ ] Nella creazione del paziente serve una tickbox che se tickata imposta la join date a "adessp", se no la si inserisce (endpoint join)
- [ ] Nella pagina del paziente si puo' editare la join date e la closing date (enpoint exit)
## altro
- [X] bug autobuild docker
- [ ] dockerfile frontend
- [ ] dischi persistenti nel dockerfile + dargli un nome
- [ ] togliere volumi montati nei compose
