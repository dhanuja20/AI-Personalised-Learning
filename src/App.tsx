import { useState } from "react";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";

type Page = "home" | "login" | "register" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <>
      {page === "home" && <Home setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
    </>
  );
}