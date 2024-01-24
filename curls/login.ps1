# Define the endpoint URL
$endpoint = "http://localhost:8000/login"

# Define the form data parameters
$formData = @{
    grant_type = "password"
    username   = "dottore-alice"
    password   = "alice"
    scope      = "items:read"
}

# Send the POST request with form data
$response = Invoke-RestMethod -Uri $endpoint -Method Post -Form $formData

# Display the response
$response
