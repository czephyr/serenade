# Sviluppi Futuri

## Logging

### Backend

Per implementare il logging delle azioni all'interno dell'applicazione (come aggiunta di un paziente, apertura di un ticket, ecc..) si consiglia di utilizzare il modulo `logger` della libreria standard di Python. Un guida completa può essere [consultata qui](https://docs.python.org/3/howto/logging.html).

In breve, può essere sufficiente inserire messaggi di logging in tutti i metodi specificati in `backend/app/src/api/endpoints`, ad esempio:

```py
@router.post("/{ticket_id}/messages")
def create_message(
    ticket_id,
    ticket_message,
    role: str = Depends(require_role([IIT, IMT])),
):
    try:
        # %%
        logger.info(f"POST a new message on ticket {ticket_id} from {role}")
        # ####
        result = ticket_messages.create()
    except Exception as e:
        # %%
        logger.warn(f"POST failed: {e}")
        # ####
        raise e
    else:
        # %%
        logger.debug(f"The message {ticket_message} has been added succesfully to ticket {ticket_id}")
        # ####
        return result

```

È comunque necessario creare l'oggetto `logger` e impostarne la formattzione e gli handlers dell'output (file, stdout, ecc..).

Inolte, attraverso il Token JWT manipolato nel file `backend/app/src/api/deps.py` si ha accesso alle generalità dell'utente che sta eseguendo la chiamata.

### Keycloak

Gli accessi e le modifiche effettuate all'interno di Keycloak (qundi la registrazione degli account e l'assegnazione a gruppi utente) non sono automaticamente registrate.
Per ottenere un log di queste azioni è necessarion implementare un `EventListener`.
Alcuni esempi possono essere trovati nella [repository ufficiale](https://github.com/p2-inc/keycloak-events) di Keycloak Events.

## Ruoli multipli

I punti chiave per integrare ruoli multipli all'interno della piattaforma sono

1. Permettere all'utente di scegliere (lato frontend) con quale ruolo vuole autenticarsi
2. Valutare il ruolo utilizzato nelle richieste per scegliere di conseguenza il modello dati da restituire.

Buona pratica vuole che per un singolo metodo (a.e `GET /installations/{id}`) il modello dati sia unico, e che alcuni suoi campi siano facoltativi e di conseguenza omessi se il ruolo non è autorizzato o interessato a vederli.
Se i modelli dei dati da restiture differiscono sostanzalmente in base al ruolo, è consigliato creare medodi diversi per accedere alla stessa risorsa.

Se le regole di accesso dovessero diventare complesse, si consiglia di deprecare il controllo nativo dei permessi nel `backend`, e di implementare invece il [controllo degli accessi con Keycloak](https://www.keycloak.org/docs/latest/authorization_services/index.html).

## Assegnazione ticket

Per poter gestire un eventuale assegnamento dei ticket è necessario modificare lo schema relazione del database in modo da tenere traccia della (entità) assegnazione.
Possono essere approtate modifiche al `backend` per non inoltrare ticket non assegnati all'utente corrente, oppure al `frontend` con l'aggiunta di un semplice filtro ***"I miei ticket"***.
