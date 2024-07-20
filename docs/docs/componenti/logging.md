# Logging

La piattaforma ha un requisito di logging necessario a storicizzare gli accessi degli utenti ai dati. 

Per l'implementazione del requisito si consiglia di inserire alle chiamate backend nelle RESTApi il logger di Python. Attraverso il token JWT inoltrato nella chiamata si ha accesso alle generalita' dell'utente che sta eseguendo le chiamate, nel corpo o nell'url della request vengono riportati il tipo di dati richiesti. Storicizzando entrambi questi elementi si ha una visione completa degli accessi. 