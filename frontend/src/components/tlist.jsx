import { useEffect, useState } from "react";
import api from "../api";

export default function TicketList({ refresh }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const fetchTickets = async () => {
    const res = await api.get("tickets/");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setPriority(ticket.priority);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const updateTicket = async () => {
    if (!selectedTicket) return;

    await api.patch(`tickets/${selectedTicket.id}/`, {
      status,
      priority,
    });

    fetchTickets();
    closeModal();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets yet</p>
      ) : (
        <ul className="space-y-3">
          {tickets.map(ticket => (
            <li
              key={ticket.id}
              className="border p-3 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => openModal(ticket)}
            >
              <p className="font-medium">{ticket.title}</p>
              <p className="text-sm text-gray-600">{ticket.description}</p>

              <div className="text-xs mt-2">
                <span>{ticket.category}</span> |{" "}
                <span>{ticket.priority}</span> |{" "}
                <span className="font-semibold">
                  {ticket.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-4">
              Update Ticket #{selectedTicket.id}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full border p-2 rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Priority</label>
                <select
                  className="w-full border p-2 rounded"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={updateTicket}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}