from fastapi import FastAPI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List


class Patient(BaseModel):
    PID: str
    DataNick: str


app = FastAPI(
    debug=True,
    title="serenade",
)


@app.get("/hello")
@app.post("/hello")
def hello():
    return {"message": "Hello World"}


patients_db = []


@app.get("/patients", response_model=List[Patient])
def get_patients():
    return patients_db


@app.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: int):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients_db[patient_id]


@app.post("/patients", response_model=Patient)
def create_patient(patient: Patient):
    patients_db.append(patient)
    return patient


@app.put("/patients/{patient_id}", response_model=Patient)
def update_patient(patient_id: int, updated_patient: Patient):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    patients_db[patient_id] = updated_patient
    return updated_patient


@app.delete("/patients/{patient_id}", response_model=Patient)
def delete_patient(patient_id: int):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    deleted_patient = patients_db.pop(patient_id)
    return deleted_patient


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
