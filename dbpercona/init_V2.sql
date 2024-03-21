CREATE TABLE IF NOT EXISTS patients (
    patient_id INT UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    cf VARCHAR(255) PRIMARY KEY,
    address TEXT,
    contact VARCHAR(255),
    medical_notes VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS installations (
    install_num INT PRIMARY KEY,
    install_notes VARCHAR(255),
    install_time datetime,
    patient_id INT, 
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id SERIAL PRIMARY KEY,
    ticket_open_time datetime,
    ticket_close_time datetime,
    status VARCHAR(255),
    FOREIGN KEY (install_num) REFERENCES installations(install_num)
);

CREATE TABLE IF NOT EXISTS ticket_message (
    message_id SERIAL PRIMARY KEY,
    message_time datetime,
    sender VARCHAR(255),
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

CREATE TABLE IF NOT EXISTS patient_status (
    patient_id INT PRIMARY KEY,
    imt_installation BOOLEAN DEFAULT FALSE,
    iim_validation BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS patient_PID (
    patient_id INT PRIMARY KEY,
    PID_sha_identifier VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS patient_INSTNUM (
    patient_id INT PRIMARY KEY,
    INSTNUM_aes_indentifier  VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);


CREATE OR REPLACE FUNCTION insert_patient_status() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO patient_status (patient_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patient_insert_after
AFTER INSERT ON patients
FOR EACH ROW EXECUTE FUNCTION insert_patient_status();