import { useState } from "react";
import TicketForm from "./components/ticket-form";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TicketForm onTicketCreated={() => setRefresh(!refresh)} />
      </div>
    </div>
  );
}