#!/bin/bash
realm_name=serenade
echo "KeyCloak Contanier ID or Name:"
read kc
docker exec $kc /opt/keycloak/bin/kc.sh export --file /opt/keycloak/data/import/$realm_name --realm $realm_name.json