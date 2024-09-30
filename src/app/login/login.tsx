"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./login.module.css"; // Import styles if needed

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Here, replace with your authentication logic
    if (username === "admin" && password === "password") {
      // Redirect to the home page upon successful login
      router.push("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username / Email</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
