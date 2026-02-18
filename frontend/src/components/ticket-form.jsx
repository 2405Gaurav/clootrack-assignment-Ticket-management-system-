import { useState } from "react";
import api from "../api";

export default function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  const classify = async (desc) => {
    if (!desc) return;

    try {
      setLoading(true);
      const res = await api.post("tickets/classify/", {
        description: desc,
      });

      setCategory(res.data.suggested_category || "");
      setPriority(res.data.suggested_priority || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("tickets/", {
      title,
      description,
      category,
      priority,
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("");

    onTicketCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        onBlur={() => classify(description)}
        required
      />

      {loading && <p>Classifying...</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
}