# 🎻 serenade
THE PROJECT IS WIP.
## Project Overview
This project is a Pilot study for developing a platform to support the Serenade medical study by Policlinico di Milano in collaboration with Universita' degli studi di Milano. The platform is needed to facilitate the intercollaboration between the Hospital personnel, the hardware installators and the University team of researchers overseeing the study. 

Considering the GDPR's classification of medical data as Special Category Data, the platform ensures precise management and monitoring of data accesses. To achieve correct data access governance the platform follows RBAC (Role-Based Access Control) authorization using the OpenID Connect standard; the access are monitored and store using a modern observability stack.

### Platform Actors
The actors interacting with the system are: hospital personnell (HOS) inputting data about patients, IIM and IIT which are installation teams for the needed hardware in the patients home and the are the researchers overseeing the study (UniMi). 
<img src="images/actors.png" alt="actors" width="500"/>

### System Architecture

![arch](images/architecture.drawio.svg)


## Observability

### Tools
<img src="https://avatars.githubusercontent.com/u/49998002?s=280&v=4" width=36 height=36 /> OpenTelemetry |
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiM_X9eBjE6gh829tNc_-Vq5UjdGMtzcvu6eXaRDdg5tQT9UO3uh7awaTOP7h7h4-sv1U&usqp=CAU" width=36 height=36 /> Jaeger | 
<img src="https://files.readme.io/e5e1b43-grafana-loki.png" width=36 height=36 /> Loki |
<img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Grafana_icon.svg" width=36 height=36 /> Grafana |

### Explaination

The objective is to observe and store accesses by users to portions of the data. We use logs, metrics and traces are employed to this objective.
Grafana gives general observability over the health of the platform using the Prometheus metrics exposed by the backend and logs stored on Loki.

<img src="images/grafana_dash_img.png" width=700 />

Thanks to OpenTelemetry's context injection each log can be linked to the request that originated it, which can be then observed on the Jaeger tracing dashboard. Traces allow to observe each request's path as it passes through the microservices.

<img src="images/jaeger_dashboard_img.png" width=700 />

## Backend 
The backend of the service is implemented following a REST api structure and serving data under RBAC authorization from the Keycloack IAM module. 
### Tools
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width=36 height=36 /> Python | <img src="https://www.jetbrains.com/guide/assets/fastapi-6837327b.svg" width=36 height=36 /> FastAPI | <img src="https://avatars.githubusercontent.com/u/110818415?v=4&s=160" width=36 height=36 /> Pydantic | <img src="https://quintagroup.com/cms/python/images/sqlalchemy-logo.png/@@images/eca35254-a2db-47a8-850b-2678f7f8bc09.png" width=120 height=36 /> SqlAlchemy  


### Folder structure explaination

```
── api  ## rest endpoints
│   ├── api.py  ## url routes
│   ├── deps.py ## dependency injections
│   └── endpoints
│       ├── auth.py
│       ├── installations.py
│       └── patients.py
|       ...
├── crud  ## functions accessing the db
│   ├── crud_installation.py
│   └── crud_patient.py
|    ...
├── models  ## SQLAlchemy db object models
│   ├── notes.py
│   └── patient.py
|   ...
├── schemas ## Pydantic logical object schemas
│   ├── installation.py
│   └── patient.py
|   ...
├── core  ## various configs
│   ├── config.py
│   ├── keycloak_config.py
│   └── security.py
├── db   ## db configs
│   ├── base_class.py
│   └── session.py
├── main.py
└── utils  ## various utils
    └── local_utils.py
```

## Database
### Tools
<img src="https://netdata.cloud/img/percona.svg" width=36 height=36 /> Percona postgreSQL
### Explaination
The database table storing data that could identify patients is stored under transparent data encryption as additional security measure by using the `pg_tde` functionality offered by this Percona postgreSQL16 distribution.

## Frontend
### Tools
<img src="https://next-auth.js.org/img/logo/logo-sm.png" width=36 height=36 /> NextAuth.js | <img src="https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png" width=36 height=36 /> Next.js

### Explaination
The frontend has been implemented in NextJS which is a widely used frontend framework and offers good interoperability with the Keycloack IAM module through the NextAuth.js library. 

## IAM
### Tools
<img src="https://cf.appdrag.com/dashboard-openvm-clo-b2d42c/uploads/Keycloak-VC4L-19JH.png" width=80 height=80 /> KeyCloak

### Explaination
The RBAC Auth and AuthZ model is realized through microservices making requests to the Keycloak component. Keycloak is an open-source identity and access management solution that not only provides comprehensive IAM capabilities on its own but also supports extensions and can serve as an adapter for external IdPs.

## Logic Model

### V0 - Fist model draft
```
Patient(PID, I#)
Installation(I#)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(PID, ...)

Ticket(DateTime, I#, RefNo, Status, Notes)
```
### V1 - Concept of `Stream` entity
```
Patient(PID)
Installation(I#)
Stream(I#, PID)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(PID, ...)

Ticket(DateTime, I#, RefNo, Status, Notes)
```
### V2 - Refactoring
```
Patient(PID, DataNick)
Installation(I#, HouseNick)
Stream(SID, HouseNick, DataNick)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(SID, ...)

Ticket(DateTime, HouseNick, RefNo, Status, Notes)
```
**Advantages of V2 model:**
It's not neede to specify the capabilities for all lookup combinations, anyone who already has `Key` to decrypt lookup tables is authorized a priori to perform any lookup combination on the same table.

#### Lookup Tables
|              | Doctor | Monitor | Tech |
| ------------ | ------ | ------- | ---- |
| Patient      | ✅      | ❌       | ❌    |
| Installation | ✅      | ❌       | ✅    |
| Stream       | ✅      | ✅       | ❌    |

#### Other Tables
|                | Doctor | Monitor | Tech |
| -------------- | ------ | ------- | ---- |
| PatientGeneral | ✅      | ❌       | ✅    |
| PatientDetail  | ✅      | ❌       | ❌    |
| SensitiveData  | ⭕      | ✅       | ❌    |
| Ticket         | ✅      | ✅       | ✅    |

## Authentication with KeyCloak

### Signup without IdP
```mermaid
sequenceDiagram
    actor Doctor
    participant App
    participant API
    participant KeyCloack
    actor Admin
    Doctor->>KeyCloack: Send (Email,Password)
    KeyCloack->>Doctor: OK
    KeyCloack-->>KeyCloack: Store 
    Admin->>KeyCloack: Add capabilities 
```
### Signup with IdP

```mermaid
sequenceDiagram
    participant IdP
    actor Doctor
    participant App
    participant KeyCloack
    Doctor->>KeyCloack: Send (IdP)
    KeyCloack->>Doctor: Ask (Token)
    Doctor->>IdP: Check (Email,Password)
    IdP->>Doctor: OK (Token)
    Doctor->>KeyCloack: Send (Token)
    KeyCloack->>IdP: Check (Token)
```

## Option A: Server side encypton
Some DB Framework (like PostgreSQL) supports fine-grained access control at the table level through the use of roles and permissions. You can assign specific privileges to those roles for particular tables. This allows you to control who perform certain actions on specific tables and log them.

1. **Roles** for different responsibilities in the application.

    ```sql
    CREATE ROLE dottore;
    CREATE ROLE tecnico;
    CREATE ROLE monitor;
    ```

2. **Grant Privileges**  to each role for the relevant tables.

    ```sql
    GRANT SELECT, INSERT, UPDATE, DELETE ON PatientDetail TO dottore;
    GRANT SELECT, INSERT ON Ticket TO tecnico;
    GRANT SELECT ON SensitiveData TO monitor;
    ```

3. **Assign Roles** to users:

    ```sql
    GRANT dottore TO dottore-alice;
    GRANT tecnico TO tecnico-bob;
    GRANT monitor TO monitor-charlie;
    ```

Then the dataset can be encypted using TDE (Transparent Data Encryption) on server side.

## Option B: Client side encryption

### Login
The KeyStore API must be a trusted microservice. It allows to:
1. Don't save `Key` on client app
2. Regenerate `Key` when needed (forgot `Secret`, reset client app)
```mermaid
sequenceDiagram
    actor Doctor
    participant App
    participant KeyStore API
    participant KeyCloack
    Doctor->>KeyCloack: Send (Email,Password)
    KeyCloack->>App: OK (Token)
    App->>Doctor: Ask (Secret)
    Doctor->>App: Set (Secret)
    App->>KeyStore API: Generate Key (Secret, Token)
    KeyStore API->>KeyCloack: Check Capabilities (Token)
    KeyCloack->>KeyStore API: OK
    KeyStore API->>App: Send (Key)
    App->>App: Encrypt (Key, Secret)
```
`Key` will be used to encrypt data on client side. Key is encryped with `Secret`

### Pull and Push Data
```mermaid
sequenceDiagram
    actor Doctor
    participant App
    participant API DB
    participant DataBase
    Doctor->>App: Send (Secret)
    App-->>App: Decrypt (Key, Secret)
    alt PUSH
        Doctor->>App: Get / Post (Patient)
        App-->>App: Encrypt (Patient, Key)
        App->>DataBase: Send (Encrypted(Patient))
    end
    alt PULL
        DataBase->>App: Send (Encrypted(Patient))
        App-->>App: Decrypt (Encrypted(Patient), Key)
        App->>Doctor: Send (Patient)
    end
```

