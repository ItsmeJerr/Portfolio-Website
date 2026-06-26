import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data, error: loginError } = await supabase
        .from("users")
        .select("username, password")
        .eq("username", username)
        .limit(1)
        .maybeSingle();

      if (loginError) {
        setError("Login failed. Please try again.");
      } else if (!data || data.password !== password) {
        setError("Incorrect username or password!");
      } else {
        localStorage.setItem("admin_logged_in", "true");
        setLocation("/admin");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-foreground">
            Username
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-foreground">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
