# TODO

## dbpercona
- [ ] chiave per crittografare
- [ ] logica `ON DELETE`
  - [ ] coumunque `ON CASCADE` per gli admin, NON esposto su `endpoint`
  - [ ] bannare `ON UPDATE` su tutti gli `unique`

## backend
- [ ] aggiungere `category` alla entità ticket
- [ ] `?as_role={role}` chiedere esplicitamente nell'API con che tipo di ruolo si vuole accedere ai dati (ruolo misto IIT IMT UNIMI)
- [ ] distinguere date installazione da date arruolamento
- [ ] `PUT` su name di patient
- [ ] 484 su `keycloak_openid.introspect`
- [ ] wrapper crypto per mascherare `patient_id`
- [ ] wrapper 404
- [ ] solleva `LOCKED` su open/close invalido
- [ ] allunga nomi funzioni endpoint (così si specchiano)
- [ ] dataset diverso da arlecchino

## keycloak
- [ ] SSL

## frontend
- [ ] Nei dettagli paziente, il tasto per seguire alle dashboards anche nei dettagli `{DASHBOARD_SERVER_URL}?pid={patient_id}`
- redirects
  - [ ] sign up `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/login-actions/registration`
  - [ ] account details `{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM_NAME}/account/`

## altro
- [ ] bug autobuild docker
- [ ] dockerfile frontend