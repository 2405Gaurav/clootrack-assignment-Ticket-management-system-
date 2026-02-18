import { useState } from "react";
import api from "../api";
import { Loader2, Send, Sparkles, TicketCheck, BrainCircuit } from "lucide-react";

export default function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClassified, setIsClassified] = useState(false);

  const classify = async (desc) => {
    if (!desc || desc.length < 10) return;
    try {
      setLoading(true);
      const res = await api.post("tickets/classify/", { description: desc });
      setCategory(res.data.suggested_category || "");
      setPriority(res.data.suggested_priority || "");
      setIsClassified(true);
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
      setIsClassified(false);
      onTicketCreated();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white border border-indigo-100 rounded-3xl shadow-2xl shadow-indigo-100/50 p-8">
      {/* Decorative background blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50" />

      <div className="relative mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Create Ticket
          </h2>
          <p className="text-slate-500 text-sm mt-1">Submit your request with AI-powered assistance.</p>
        </div>
        <div className="p-3 bg-indigo-50 rounded-2xl">
            <TicketCheck className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-indigo-400 uppercase ml-1 flex items-center gap-1">
            Subject
          </label>
          <input
            placeholder="Briefly describe the issue..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold text-indigo-400 uppercase">Details</label>
            {isClassified && (
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <BrainCircuit className="w-3 h-3" /> AI OPTIMIZED
                </span>
            )}
          </div>
          <div className="relative">
            <textarea
              placeholder="Tell us more about what's happening..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all resize-none outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => classify(description)}
              required
            />
            {loading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-indigo-600 px-3 py-1.5 rounded-xl text-white text-xs font-medium shadow-lg animate-bounce">
                <Sparkles className="w-3 h-3" />
                Thinking...
              </div>
            )}
          </div>
        </div>

        {/* Selectors Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl text-sm focus:outline-none transition-all cursor-pointer appearance-none ${
                isClassified ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <option value="">Category</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
          </div>

          <div className="space-y-1">
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl text-sm focus:outline-none transition-all cursor-pointer appearance-none ${
                isClassified ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="group w-full flex items-center justify-center gap-2 py-4 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95 cursor-pointer mt-4"
        >
          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Submit Ticket
        </button>
      </form>
    </div>
  );
}