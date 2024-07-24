# Workflows

## Amministratore

L'amministratore della piattaforma è in possesso delle credenziali amministrative di Keycloak e si occupa di creare le utenze degli utenti che faranno uso della piattaforma.
Per informazioni sul processo di creazione delle utenze riferirsi alla sezione `Componenti/Keycloak` di questa documentazione.

## Utenti

La piattaforma definisce 4 tipologie di utenti che sono `imt`, `iit`, `unimi`, `dottore`.
Account demo:

|Ruolo|`username`|`password`|
|-|-|-|
|HOS|`dottore-alice`|`alice`|
|IIT|`iit-gennaro`|`gennaro`|
|IMT|`imt-vincenzo`|`vincenzo`|
|UNIMI|`ricercatore-stefano`|`stefano`|

### IMT

L'`imt` può visionare le installazioni, creare ticket e inserire messaggi sui ticket.

### IIT

L'`iit` può visionare le installazioni, chiudere ticket e inserire messaggi sui ticket.

### Dottore

Gli utenti con ruolo `dottore` possono creare/eliminare pazienti e accedere alle visualizzazioni dei dati dei pazienti.

### Unimi

Gli utenti con ruolo `unimi` possono visualizzare le installazioni.
