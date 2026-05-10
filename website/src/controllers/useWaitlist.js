import { useState } from "react";

export function useWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    // Simulate API call — wire up real endpoint later
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setMessage("You're on the list! We'll notify you at launch. 🎉");
    setEmail("");
  };

  const reset = () => { setStatus("idle"); setMessage(""); };

  return { email, setEmail, status, message, submit, reset };
}
