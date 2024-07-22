# Comportamenti della piattaforma

La piattaforma ha alcuni comportamenti di default che vengono appuntati qui come referenza.

## Inserimento dei dati del paziente con Codice Fiscale

Durante l'inserimento dei dati del paziente basta inserire il codice fiscale e le generalita' verranno calcolate in base a quello.

### Creazione di paziente e installazione

Al momento della creazione del paziente da parte del dottore il backend crea anche una installazione equivalente, che viene mostrata ad IMT e IIT. Inoltre all'installazione creata viene automaticamente associato un ticket di tipo 'Installazione' che dovra' essere chiuso dall'IIT.

## Data di arruolamento, data inizio e fine raccolta dati

Alla creazione del paziente viene impostata la data `date_join` che è visualizzata sulla GUI come data di *Arruolamento*.

Al momento di chiusura del primo ticket automatico di **installazione** viene settata la data `date_start` che viene mostrata nella pagina dell'installazione come *Data inizio raccolta dati*; in questo stesso momento viene anche impostata la data `date_end` (*Data fine raccolta dati*) al valore di `date_start`+12 mesi in maniera preventiva.

Il valore di `date_end` viene pero' sovrascritto quando si chiude il ticket di **disinstallazione**.

## Stati

La piattaforma ha 6 stati:

- *Da installare*: L'installazione ha un ticket di tipo installazione aperto
- *Funzionante*: Non ci sono ticket aperti
- *In Manutenzione*:  L'installazione ha un ticket di tipo manutenzione aperto
- *In disinstallazione*: L'installazione ha un ticket di tipo disinstallazione aperto
- *Inattivo*: è stato chiuso un ticket di disinstallazione
- *Sconosciuto*: La piattaforma non è stata in grado di associare nessuna delle condizioni sopra elencate

## Eliminazione di un paziente

Gli utenti di tipo `dottore` possono eliminare i pazienti. L'eliminazione di un paziente è una operazione che richiede attenzione perche' elimina sia il paziente, sia l'installazione sia i ticket associati all'installazione.
