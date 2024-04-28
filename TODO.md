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

## keycloak
- [ ] SSL
- [ ] gruppo admin

## frontend
- [ ] Nei dettagli paziente, il tasto per seguire alle dashboards anche nei dettagli `{DASHBOARD_SERVER_URL}?pid={patient_id}`
- redirects
  - [ ] sign up `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/login-actions/registration`
  - [ ] account details `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/account/`

## altro
- [X] bug autobuild docker
- [ ] dockerfile frontend
- [ ] dischi persistenti nel dockerfile + dargli un nome
- [ ] togliere volumi montati nei compose
