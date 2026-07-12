import React, { useState } from "react";

type Page = "home" | "login" | "register" | "dashboard";

type RegisterProps = {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

export default function Register({ setPage }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    if (name === "" || email === "") {
      alert("Please fill all fields");
      return;
    }

    alert("Registration Successful!");

    localStorage.setItem(
      "student",
      JSON.stringify({
        name,
        email,
      })
    );

    setPage("login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "350px" }}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <button onClick={handleRegister}>Register</button>

        <br />
        <br />

        <button onClick={() => setPage("login")}>
          Already have an account? Login
        </button>
      </div>
    </div>

  );
  setPage("dashboard");
}