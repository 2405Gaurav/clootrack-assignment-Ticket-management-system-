import { useState } from "react";
import TicketForm from "./components/ticket-form";
import TicketList from "./components/tlist";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">


          <div className="relative mb-6 pb-4 border-b border-indigo-50">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-indigo-400/80">
          Clooktrack Assignment (Django/react/postgres)
        </h1>
      </div>
        <TicketForm onTicketCreated={() => setRefresh(!refresh)} />

        <TicketList refresh={refresh} />

      </div>
    </div>
  );
}