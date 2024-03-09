CREATE TABLE IF NOT EXISTS patients (
    patient_id INT UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    cf VARCHAR(255) PRIMARY KEY,
    address TEXT,
    contact VARCHAR(255),
    medical_notes VARCHAR(255),
    install_num INT UNIQUE,
    install_time TIMESTAMP, -- Changed datetime to timestamp
    CONSTRAINT patients_install_num_fkey FOREIGN KEY (install_num) REFERENCES patients(install_num)
) USING pg_tde;

CREATE TABLE IF NOT EXISTS notes (
    install_num INT, 
    install_notes VARCHAR(255),
    FOREIGN KEY (install_num) REFERENCES patients(install_num)
);

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id SERIAL PRIMARY KEY,
    install_num INT, -- Added missing column to create a foreign key relationship
    ticket_open_time TIMESTAMP, -- Changed datetime to timestamp
    ticket_close_time TIMESTAMP, -- Changed datetime to timestamp
    status VARCHAR(255),
    CONSTRAINT tickets_install_num_fkey FOREIGN KEY (install_num) REFERENCES patients(install_num)
);

CREATE TABLE IF NOT EXISTS ticket_messages ( -- Table name changed to be plural for consistency
    message_id SERIAL PRIMARY KEY,
    message_time TIMESTAMP, -- Changed datetime to timestamp
    sender VARCHAR(255),
    ticket_id INT,
    CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);