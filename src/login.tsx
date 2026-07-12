import React, { useState } from "react";

type Page = "home" | "login" | "register" | "dashboard";

type LoginProps = {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

export default function Login({ setPage }: LoginProps) {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    localStorage.setItem(
      "student",
      JSON.stringify({
        name: "Dhanuja",
        email: email,
      })
    );

    setPage("dashboard");
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}