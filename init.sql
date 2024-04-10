CREATE TABLE IF NOT EXISTS patients (
    patient_id bigint UNIQUE,
    age_range VARCHAR(255), -- 65-74, 75-84, 85+
    full_name VARCHAR(255),
    cf VARCHAR(255) PRIMARY KEY,
    address TEXT,
    phone_number VARCHAR(255),
    contact VARCHAR(255),
    medical_notes TEXT,
) USING pg_tde;

CREATE TABLE IF NOT EXISTS patients_non (
    patient_id bigint UNIQUE,
    install_num bigint UNIQUE,
    neurodegen BOOLEAN,
    apartment_type VARCHAR(255), -- e.g. two-room, three-room
    wifi BOOLEAN,
    other_subjects_in_home TEXT,
    smartphone_model VARCHAR(255),
    creation_time TIMESTAMP
)

CREATE TABLE IF NOT EXISTS installation (
    id SERIAL PRIMARY KEY,
    home_map bytea, -- Store the PDF as binary data
    smart_plug_appliances text, -- List of home appliances connected to smart plugs
    technical_problems_notes text, -- Notes on technical problems
    subject_specific_habits_notes text, -- Non-identifying notes about the subject
    cognitive_tests_timing_notes text, -- Notes on preferred times for triggering cognitive tests
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    install_num bigint UNIQUE, 
    install_notes VARCHAR(255),
    FOREIGN KEY (install_num) REFERENCES patients(install_num)
);

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id SERIAL PRIMARY KEY,
    install_num bigint UNIQUE, -- Added missing column to create a foreign key relationship
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