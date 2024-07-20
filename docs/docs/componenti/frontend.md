# Frontend

La sezione frontend della piattaforma e' scritta in NextJS. L'interazione con il backend avviene attraverso le chiamate agli endpoint REST NextJS (il cui codice risiede in `src/app/api`) che si occupano di aggiungere il token JWT e inoltrare le chiamate ai REST endpoint offerti del backend. 

L'interazione con Keycloak e' gestita attraverso la libreria NextAuth, si rimanda alla documentazione della stessa.

## App

```
.
└── src
    ├── app
    │   ├── api
    │   │   ├── auth ## Configs for NextAuth
    │   │   │   └── ...
    │   │   ├── documents ## NextJS rest api endpoints that forward requests to the backend
    │   │   │   └── ...                 
    │   │   ├── installations ## NextJS rest api endpoints that forward requests to the backend
    │   │   │   └── ...
    │   │   ...
    │   ├── installations ## NextJS routes
    │   │   └── ...
    │   ├── patients ## NextJS routes
    │   │   └── ...
    |   ...
    ├── components ## react components
    │   └── ...
    ├── utils ## utils functions
    |   └── ...
    ...
```

La cartella `src/api` racchiude gli endpoint REST NextJS.
Le altre cartelle presenti sotto `src` racchiudono le routes per ogni sezione della piattaforma. 
Le routes sono pagine server-side composte da componenti client-side che si occupano di renderizzare i dati, importati dalla cartella `src/components` (si rimanda alla doc di NextJS per i concetti di server-side e client-side components).
Si riporta un esempio di come e' usualmente strutturata una pagine route:
```react
<main>
    <div>
    <BackButton />
    <h1>Dettagli paziente</h1>
    <PatientDetail initialData={patient} role={roleFound} />
    <InstallationDetail installation_id={params.id} role={roleFound} />
    <DeleteButton patient_id={params.id} />
    </div>
</main>
```