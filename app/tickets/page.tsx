"use client";

import { useState, useEffect } from "react";

type Ticket = {
  _id: string;
  type: string;
  price: number;
  used: boolean;
  createdAt: string;
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  async function fetchInfo() {
    try {
      const res = await fetch("/api/info");
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await res.json();
      setTickets(data.tickets);
      setBalance(data.credits);
    } catch (err) {
      setError("Could not load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleBuyTicket = async (type: string) => {
    const response = await fetch("/api/generate-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to buy ticket");
      return;
    }

    fetchInfo();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>My tickets:</h1>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            {ticket.type} — ${ticket.price} —{" "}
            {ticket.used ? "Used" : "Valid"}
          </li>
        ))}
      </ul>
      <h2>My balance: {balance}</h2>

      <button onClick={() => handleBuyTicket("single")}>Buy ticket</button>
    </main>
  );
};

export default TicketsPage;