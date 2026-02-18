import { useState } from "react";
import api from "../api";
import { Loader2, Send, Sparkles } from "lucide-react";

export default function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  const classify = async (desc) => {
    if (!desc || desc.length < 10) return;
    try {
      setLoading(true);
      const res = await api.post("tickets/classify/", { description: desc });
      setCategory(res.data.suggested_category || "");
      setPriority(res.data.suggested_priority || "");
    } catch (err) {
      console.error("Classification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("tickets/", { title, description, category, priority });
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      onTicketCreated();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Ticket</h2>
        <p className="text-slate-500 text-sm">Describe your issue and we'll handle the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Subject</label>
          <input
            placeholder="What's going on?"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Details</label>
          <div className="relative">
            <textarea
              placeholder="Provide more context..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => classify(description)}
              required
            />
            {loading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white border border-indigo-100 px-2 py-1 rounded-lg text-indigo-600 text-xs font-medium animate-pulse">
                <Sparkles className="w-3 h-3" />
                AI Classifying...
              </div>
            )}
          </div>
        </div>

        {/* Selectors Row */}
        <div className="grid grid-cols-2 gap-4">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">Category</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>

          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-black text-white font-semibold rounded-2xl transition-all hover:shadow-lg active:scale-95 cursor-pointer mt-2"
        >
          <Send className="w-4 h-4" />
          Submit Request
        </button>
      </form>
    </div>
  );
}