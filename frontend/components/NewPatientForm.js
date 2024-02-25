"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
export default function NewPatientForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status == "unauthenticated" ||
      (status == "authenticated" && !session.roles?.includes("dottore"))
    ) {
      router.push("/unauthorized");
      router.refresh();
    }
  }, [session, status, router]);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const ageRef = useRef();
  const genderRef = useRef();
  const ssnRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();

  const [errorMsg, setErrorMsg] = useState('');
  
  if (status == "loading") {
    return (
      <main>
        <h1 className="text-4xl text-center">Create patient</h1>
        <div className="text-center text-2xl">Loading...</div>
      </main>
    );
  }

  if (session && session.roles?.includes("dottore")) {
    const handleSubmit = async (event) => {
      event.preventDefault();

      const postBody = {
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        age: parseInt(ageRef.current.value, 10),
        gender: genderRef.current.value,
        ssn: ssnRef.current.value,
        address: addressRef.current.value,
        phone_number: phoneNumberRef.current.value,
      };

      const token = session.token_token
      const url = `http://0.0.0.0:8000/patients/`;
      try {
        console.log("sending" + JSON.stringify(postBody))
        const resp = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(postBody),
        });

        if (resp.ok) {
          router.push("/patients");
          router.refresh();
        } else {
          var json = await resp.json();
          setErrorMsg("Unable to call the API: " + json.error);
        }
      } catch (err) {
        setErrorMsg("Unable to call the API: " + err);
      }
    };

    return (
      <main>
        <h1 className="text-4xl text-center">Create product</h1>

        <form onSubmit={handleSubmit} className="mt-6">
        <div className="field">
            <label htmlFor="firstName" className="label">First Name:</label>
            <input type="text" id="firstName" ref={firstNameRef} required />
          </div>
          <div className="field">
            <label htmlFor="lastName" className="label">Last Name:</label>
            <input type="text" id="lastName" ref={lastNameRef} required />
          </div>
          <div className="field">
            <label htmlFor="age" className="label">Age:</label>
            <input type="number" id="age" ref={ageRef} required />
          </div>
          <div className="field">
            <label htmlFor="gender" className="label">Gender:</label>
            <select id="gender" ref={genderRef} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="ssn" className="label">Social Security Number (SSN):</label>
            <input type="text" id="ssn" ref={ssnRef} required />
          </div>
          <div className="field">
            <label htmlFor="address" className="label">Address:</label>
            <textarea id="address" ref={addressRef} required />
          </div>
          <div className="field">
            <label htmlFor="phoneNumber" className="label">Phone Number:</label>
            <input type="tel" id="phoneNumber" ref={phoneNumberRef} required />
          </div>
          <button type="submit" className="button is-link">Create Patient</button>
        </form>
      </main>
    );
  }
}