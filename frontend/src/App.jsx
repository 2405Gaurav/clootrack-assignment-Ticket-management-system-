import { useState } from "react";
import TicketForm from "./components/ticket-form";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <TicketForm onTicketCreated={() => setRefresh(!refresh)} />
    </div>
  );
}

export default App;