### adding patient

curl -X POST "http://localhost:8000/add_patient/?token=fake_hospital_token" \
     -H "Content-Type: application/json" \
     -d '{
           "first_name": "Jane",
           "last_name": "Doe",
           "age": 28,
           "gender": "Female",
           "ssn": "987-65-4321",
           "address": "456 Elm St, AnotherTown, USA",
           "phone_number": "555-6789"
         }'

curl -X POST "http://localhost:8000/add_patient/?token=fake_hospital_token" \
     -H "Content-Type: application/json" \
     -d '{
           "first_name": "Alice",
           "last_name": "Smith",
           "age": 35,
           "gender": "Female",
           "ssn": "123-45-6789",
           "address": "789 Oak St, SomeCity, USA",
           "phone_number": "555-9876"
         }'


### getting list of patients

curl -X GET "http://localhost:8000/patients/?token=fake_hospital_token"
