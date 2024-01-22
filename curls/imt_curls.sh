#!/bin/bash

### Retrieve hash(patient_id)=installation_num with patient_id
curl -X GET "http://localhost:8000/get_install_nums/?token=fake_imt_token"
