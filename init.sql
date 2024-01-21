CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    age INT,
    gender VARCHAR(50),
    ssn VARCHAR(255),
    address TEXT,
    phone_number VARCHAR(255)
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

CREATE TABLE IF NOT EXISTS patient_status (
    patient_id INT PRIMARY KEY,
    imt_installation BOOLEAN DEFAULT FALSE,
    iim_validation BOOLEAN DEFAULT FALSE,
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