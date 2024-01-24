# Define the API endpoint URL
$apiUrl = "http://localhost:8000/patients"

# Define the patient data
$patientData = @{
    PID = "PippoBaudo"
    DataNick = 5432
}

# Convert the patient data to JSON
$jsonData = $patientData | ConvertTo-Json

# Set the content type header
$headers = @{
    'Content-Type' = 'application/json'
}

# Send the POST request to create a patient
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $jsonData

# Display the response
$response
