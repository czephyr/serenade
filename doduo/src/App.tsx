import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import internal from 'stream';
import Login from './components/Login';

class Patient {
  PID: string;
  DataNick: string;

  constructor({ PID, DataNick }: { PID: string; DataNick: string }) {
    this.PID = PID;
    this.DataNick = DataNick;
  }
}

async function fetchPatients(): Promise<Patient[]> {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
}

const patients = [
  new Patient({ DataNick: 'Cabbage', PID: "1" }),
  new Patient({ DataNick: 'Garlic', PID: "2" }),
  new Patient({ DataNick: 'Apple', PID: "3" }),
];

function RenderPatients() {
  const listItems = patients.map(patient =>
    <li key={patient.PID}>
      <>{patient.DataNick} : {patient.PID}</>
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}


function App() {
  return (
    <div>
      <h1>Pazienti</h1>
      <ul>
        <RenderPatients />
        <Login />
      </ul>

    </div>
  );
}

export default App;

