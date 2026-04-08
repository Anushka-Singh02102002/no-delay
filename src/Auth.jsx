import React, { useState } from "react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields required");
      return;
    }

    if (!isLogin && !form.name) {
      setError("Name required");
      return;
    }

    setError("");

    if (isLogin) {
      console.log("Login:", form);
    } else {
      console.log("Register:", form);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>{isLogin ? "Login" : "Register"}</h3>

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            style={styles.input}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          style={styles.input}
          onChange={handleChange}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Create new account"
            : "Already have account? Login"}
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eeeeee",
  },
  form: {
    width: "260px",
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "8px",
    background: "#dddddd",
    border: "1px solid #aaa",
    cursor: "pointer",
  },
  toggle: {
    marginTop: "10px",
    fontSize: "14px",
    color: "blue",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
  },
};

export default Auth;