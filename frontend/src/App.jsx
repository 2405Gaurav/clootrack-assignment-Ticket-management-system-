import { useState } from "react";
import TicketForm from "./components/ticket-form";
import TicketList from "./components/tlist";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        

        
        <TicketForm onTicketCreated={() => setRefresh(!refresh)} />

        <TicketList refresh={refresh} />

      </div>
    </div>
  );
}