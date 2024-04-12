CREATE TABLE IF NOT EXISTS patients (
    patient_id bigint UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    cf VARCHAR(255) PRIMARY KEY,
    address TEXT,
    contact VARCHAR(255),
    medical_notes VARCHAR(255),
    install_num bigint UNIQUE,
    creation_time TIMESTAMP
) USING pg_tde;

CREATE TABLE IF NOT EXISTS notes (
    install_num bigint UNIQUE, 
    install_notes VARCHAR(255),
    FOREIGN KEY (install_num) REFERENCES patients(install_num)
);

-- Table: tickets
-- Description: Stores information about support tickets raised by patients.
CREATE TABLE IF NOT EXISTS tickets (
    -- Timestamp of ticket creation
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Unique identifier for the ticket
    ticket_id SERIAL PRIMARY KEY,
    -- Foreign key referencing patient ID
    patient_id BIGINT NOT NULL,
    -- End date of the ticket
    date_closed TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- Table: ticket_messages
-- Description: Stores messages exchanged within support tickets.
CREATE TABLE IF NOT EXISTS ticket_messages (
    -- Auto identifier
    id SERIAL PRIMARY KEY,
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