import React, { useState } from "react";

type Page = "home" | "login" | "register" | "dashboard";

type DashboardProps = {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

export default function Dashboard({ setPage }: DashboardProps) {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [interest, setInterest] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const getRecommendation = () => {
    switch (interest) {
      case "Python":
        setRecommendation(
          "Python Basics, Object Oriented Programming, Data Structures"
        );
        break;

      case "Artificial Intelligence":
        setRecommendation(
          "Introduction to AI, Neural Networks, AI Fundamentals"
        );
        break;

      case "Machine Learning":
        setRecommendation(
          "Machine Learning Basics, Regression, Scikit-Learn"
        );
        break;

      case "Data Science":
        setRecommendation(
          "Pandas, NumPy, Data Visualization"
        );
        break;

      case "Web Development":
        setRecommendation(
          "HTML, CSS, JavaScript, React"
        );
        break;

      default:
        alert("Please select an interest");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1>🎓 AI Personalized Learning Dashboard</h1>

      <br />

      <h2>Welcome {student.name || "Student"}</h2>

      <p>Email: {student.email || "Not Available"}</p>

      <br />

      <h3>Select Your Interest</h3>

      <select
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
        }}
      >
        <option value="">Select Interest</option>
        <option value="Python">Python</option>
        <option value="Artificial Intelligence">
          Artificial Intelligence
        </option>
        <option value="Machine Learning">Machine Learning</option>
        <option value="Data Science">Data Science</option>
        <option value="Web Development">Web Development</option>
      </select>

      <br />
      <br />

      <button
        onClick={getRecommendation}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Get Recommendation
      </button>

      {recommendation && (
        <>
          <br />
          <br />

          <div
            style={{
              border: "1px solid gray",
              padding: "20px",
              width: "400px",
              margin: "auto",
              borderRadius: "10px",
            }}
          >
            <h3>📚 Recommended Courses</h3>

            <p>{recommendation}</p>
          </div>
        </>
      )}
      <h2>📚 Learning Materials</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            width: "250px",
            borderRadius: "10px",
          }}
        >
          <h3>🐍 Python</h3>
          <p>
            • Python Basics<br />
            • Variables<br />
            • Functions<br />
            • Data Structures
          </p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            width: "250px",
            borderRadius: "10px",
          }}
        >
          <h3>🤖 Artificial Intelligence</h3>
          <p>
            • AI Fundamentals<br />
            • Machine Learning<br />
            • Neural Networks
          </p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "15px",
            width: "250px",
            borderRadius: "10px",
          }}
        >
          <h3>🌐 Web Development</h3>
          <p>
            • HTML<br />
            • CSS<br />
            • JavaScript<br />
            • React
          </p>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />

      <button
        onClick={() => setPage("login")}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}