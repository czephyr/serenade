# Aspetti di Sicurezza

## HTTPS

HTTPS è implemtentato da Traefik e garantisce una comunicazione confidenziale fra tutti i servizi, e fra un servizio e l'utente finale.

## TDE

TDE ([Trasparent Data Encryption](https://www.percona.com/blog/transparent-data-encryption-tde/)) garantisce la confidenzialità dei ***dati a riposo***.

## Mascheramento ID

Per prevenire ***linkage attack*** da determinati gruppi di utenti, è stata implementata un modulo personalizzato di mascheramento.

Prendiamo come esempio una dottoressa `alice` che salva il numero di telefono di un paziente:

|`patient_id`|`name`|`phone_no`|
|-|-|-|
|`0042`|`bob`|`000#123`|

e poi la sua diagnosi medica:

|`patient_id`|`neuro_diag`|
|-|-|
|`0042`|*dementia, stage II*|

Ora, tutti i servizi applicativi utilizzeranno `0042` per identificare `bob`.

L'obbiettivo del mascheramente è di non rivelare il valore `0042` quando non è necessario, in particolare quando ad utilizzare i servizi applicativi non è un dottore ma un tecnico esterno.

Proseguendo con l'esempio, quando un tecnico esterno `eva` scarica i dati di `bob`, riceverà un ID mascherato:

|`patient_id`|`name`|`phone_no`|
|-|-|-|
|`d34db33f`|`bob`|`000#123`|

Quando `eva` modifica il numero di telefono, continua ad usare l'ID mascherato:

|`patient_id`|`name`|`phone_no`|
|-|-|-|
|`d34db33f`|`bob`|`+39#020000`|

Il modulo di mascheramento (implementato in `backend\app\src\core\crypto.py`) valuterà il ruolo di `eva`, decifrerà l'ID riportandolo al valore originale, e salverà correttamente il nuovo numero di telefono:

|`patient_id`|`name`|`phone_no`|
|-|-|-|
|`0042`|`bob`|`+39#020000`|

Pseudocodice:

```py
if role != "tecnico_esterno":
    return func(*args, **kwargs)
else:
    kwargs["patient_id"] = AES256.decrypt(kwargs["patient_id"])
    result = func(*args, **kwargs)
    result["patient_id"] = AES256.encrypt(result["patient_id"])
    return result
```

Questo mascheramento è un layer aggiuntivo che può rende meno dannoso un possibile ***data leakage***. Ad esempio, se la tabella delle diagnosi mediche venisse divulgata, non sarebbe possible per `eva` collegare il `phone_no` a `neuro_diag`.
