"use client";

import { QrCode, Trash, Ticket as TicketIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { AppNav } from "@/components/ui/navbar";
import QRCodeDialog from "./components/QRCodeDialog";

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
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  async function fetchInfo() {
    try {
      const res = await fetch("/api/info");

      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await res.json();
      setTickets(data.tickets);
      setBalance(data.credits);
    } catch {
      setError("Could not load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleBuyTicket = async (type: "single" | "day-pass") => {
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

  const handleDeleteTicket = async (id: string) => {
    const response = await fetch(`/api/delete-ticket?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to delete ticket");
      return;
    }

    fetchInfo();
  };

  const handleOpenQr = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setQrDialogOpen(true);
  };

  const handleQrDialogChange = (open: boolean) => {
    setQrDialogOpen(open);

    if (!open) {
      setSelectedTicket(null);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <AppNav>
      <main className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex gap-2 items-center">
            My tickets
            <TicketIcon />
          </h1>

          <span className="text-sm text-muted-foreground">
            Balance: {balance}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket._id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="capitalize text-xl font-semibold">
                      {ticket.type} ticket
                    </CardTitle>

                    <CardDescription className="text-base">
                      {ticket.price} credit/s
                    </CardDescription>
                  </div>

                  <span
                    className={
                      ticket.used
                        ? "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        : "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400"
                    }
                  >
                    {ticket.used ? "Used" : "Valid"}
                  </span>
                </div>
              </CardHeader>

              <CardFooter className="border-t bg-muted/30 max-h-12 px-3 py-2">
                <div className="flex w-full justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenQr(ticket)}
                    title="Show QR code"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>

                  {ticket.used && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteTicket(ticket._id)}
                      title="Delete ticket"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleBuyTicket("single")}
            className="flex-1"
          >
            Buy single ticket
          </Button>
          <Button
            onClick={() => handleBuyTicket("day-pass")}
            variant="secondary"
            className="flex-1"
          >
            Buy day pass
          </Button>
        </div>

        <QRCodeDialog
          isOpen={qrDialogOpen}
          onOpenChange={handleQrDialogChange}
          content={selectedTicket?._id ?? ""}
          type={selectedTicket?.type ?? ""}
        />
      </main>
    </AppNav>
  );
};

export default TicketsPage;