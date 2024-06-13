-- Table: patients
-- Description: Keep tracks of patients who join or leave the project, only for HOS journaling.
CREATE TABLE IF NOT EXISTS patients (
    -- Timestamp of record creation
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Unique identifier for the patient
    patient_id TEXT PRIMARY KEY,
    -- Date when patient join the project
    date_join TIMESTAMP,
    -- Exit date if patient leave the project
    date_exit TIMESTAMP
) USING pg_tde;

-- Table: patient_screenings
-- Description: Records screenings conducted for patients, use for UNIMI analysis.
CREATE TABLE IF NOT EXISTS patient_screenings (
    -- Foreign key referencing patient ID
    patient_id TEXT PRIMARY KEY,
    -- Neurological diagnosis and degenreation classification
    neuro_diag VARCHAR(31),
    -- Age classification of patient
    age_class VARCHAR(31),

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) USING pg_tde;


CREATE TABLE IF NOT EXISTS patient_notes(
    -- Foreign key referencing patient ID
    patient_id TEXT PRIMARY KEY,
    -- Italian fiscal code / social security number
    codice_fiscale CHAR(16) UNIQUE NOT NULL,
    -- Notes on medical conditions 
    medical_notes TEXT,

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Table: patient_details
-- Description: Stores additional details useful for HOS and IIT to reach the patients.
CREATE TABLE IF NOT EXISTS patient_details (
    -- Foreign key referencing patient ID
    patient_id TEXT PRIMARY KEY,
    -- First name of the patient
    first_name VARCHAR(127) NOT NULL,
    -- Last name of the patient
    last_name VARCHAR(127) NOT NULL,
    -- Home address of the patient
    home_address VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) USING pg_tde;

-- Table: contacts
-- Description: Stores contact information related to patients.
CREATE TABLE IF NOT EXISTS contacts (
    -- Auto identifier
    id BIGSERIAL PRIMARY KEY,
    -- Foreign key referencing patient ID
    patient_id TEXT NOT NULL,
    -- Alias or nickname for contact
    alias VARCHAR(31),
    -- Phone number of the contact
    phone_no VARCHAR(15) ,
    -- Phone number of the contact
    email VARCHAR(31),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) USING pg_tde;

-- Table: installation_details
-- Description: Records details about the installation setup of patients' residences.
CREATE TABLE IF NOT EXISTS installation_details (
    -- Foreign key referencing patient ID
    patient_id TEXT PRIMARY KEY,
    -- Timestamp of installation record
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Date when installation has been opened
    date_start TIMESTAMP,
    -- Date when installation has been closed
    date_end TIMESTAMP,
    -- Type of apartment (e.g., studio, 1-bedroom)
    apartment_type TEXT,
    -- Type of internet connection
    internet_type TEXT,
    -- Counts or list of flatmates
    flatmates TEXT,
    -- List of pets in the house
    pets TEXT,
    -- Notes on visitors frequency
    visitors TEXT,
    -- Model of smartphone used by the patient
    smartphone_model TEXT,
    -- List of appliances in the residence
    appliances TEXT,
    -- Notes on installation issues
    issues_notes TEXT,
    -- Notes on residents' habits
    habits_notes TEXT,
    -- Other relevant notes
    other_notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Table storing installation documents associated with patients.
CREATE TABLE IF NOT EXISTS installation_documents(
    -- Auto-generated unique identifier for each document
    document_id BIGSERIAL PRIMARY KEY,
    -- Timestamp indicating when the document was uploaded
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Unique identifier referencing the patient associated with the document
    patient_id TEXT NOT NULL,
    -- Name of the uploaded file
    file_name TEXT,
    -- Type of the uploaded file (e.g., PDF, PNG, JPEG)
    file_type TEXT,
    -- Binary content of the uploaded file
    file_content BYTEA NOT NULL,
    -- Foreign key constraint referencing the patient ID from the patients table
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);


-- Table: tickets
-- Description: Stores information about support tickets raised by patients.
CREATE TABLE IF NOT EXISTS tickets (
    -- Timestamp of ticket creation
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Unique identifier for the ticket
    ticket_id BIGSERIAL PRIMARY KEY,
    -- Foreign key referencing patient ID
    patient_id TEXT NOT NULL,
    -- category of the ticket
    category VARCHAR(31),
    -- End date of the ticket
    date_closed TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Table: ticket_messages
-- Description: Stores messages exchanged within support tickets.
CREATE TABLE IF NOT EXISTS ticket_messages (
    -- Auto identifier
    id BIGSERIAL PRIMARY KEY,
    -- Timestamp of message
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Sender of the message
    sender VARCHAR(31) NOT NULL,
    -- body of the message
    body TEXT NOT NULL,
    -- Foreign key referencing ticket ID
    ticket_id INT NOT NULL,

    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);