import React from "react";

type Page = "home" | "login" | "register" | "dashboard";

type HomeProps = {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

export default function Home({ setPage }: HomeProps) {
  return (
    <div>
      <h1>Home</h1>

      <button onClick={() => setPage("register")}>
        Register
      </button>

      <button onClick={() => setPage("login")}>
        Login
      </button>
    </div>
  );
}