// src/components/Login.tsx

import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('username', email);
    bodyFormData.append('password', password);
    try {
      const response = await axios({
        method: "post",
        url: 'http://localhost:8000/login',
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.status === 200 && response.data.access_token) {
        // Successful login, you can handle the token here
        alert('Authentication Successful');
        alert('Token: ' + response.data.access_token);
      } else {
        // Handle authentication failure (e.g., incorrect username or password)
        alert('Authentication Failed');
      }
    } catch (error) {
      // Handle network or other errors
      alert('Error: ' + error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="string"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
