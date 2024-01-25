# 🎻 serenade

## UMLs

### Signup without ISP
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
### Signup with ISP

```mermaid
sequenceDiagram
    participant ISP
    actor Doctor
    participant App
    participant KeyCloack
    Doctor->>KeyCloack: Send (ISP)
    KeyCloack->>Doctor: Ask (Token)
    Doctor->>ISP: Check (Email,Password)
    ISP->>Doctor: OK (Token)
    Doctor->>KeyCloack: Send (Token)
    KeyCloack->>ISP: Check (Token)
```

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

## Logic Model

### V0
```
Patient(PID, I#)
Installation(I#)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(PID, ...)

Ticket(DateTime, I#, RefNo, Status, Notes)
```
### V1
```
Patient(PID)
Installation(I#)
Stream(I#, PID)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(PID, ...)

Ticket(DateTime, I#, RefNo, Status, Notes)
```
### V2
```
Patient(PID, DataNick)
Installation(I#, HouseNick)
Stream(SID, HouseNick, DataNick)

PatientGeneral(I#, Surname, Address, PhoneNo)
PatientDetail(PID, Name, SSN, *DoB, *PoB, *Age)
SensitiveData(SID, ...)

Ticket(DateTime, HouseNick, RefNo, Status, Notes)
```
**Advantages of this model:**
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

