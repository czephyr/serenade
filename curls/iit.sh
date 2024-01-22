#!/bin/bash

### Retrieve hash(patient_id)=installation_num with patient info
curl -X GET "http://localhost:8000/patient_details/?token=fake_iit_token"
