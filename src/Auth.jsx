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
    
    // ✅ Save user to localStorage
    localStorage.setItem("user", JSON.stringify({ 
      name: form.name || "User", 
      email: form.email 
    }));
    
    // ✅ Reload page to show MainPage
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && <p style={styles.error}>{error}</p>}

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

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
    background: "#4ddddd",
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