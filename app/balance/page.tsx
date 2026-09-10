"use client";

import { CreditCard, Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AppNav } from "@/components/ui/navbar";

const packages = [
  { credits: 1, price: 1.0, discount: 0 },
  { credits: 5, price: 4.5, discount: 10 },
  { credits: 10, price: 9.0, discount: 10 },
];

export default function BalancePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
    setError(null);
    setSuccess(false);
  };

  const validateInputs = (): boolean => {
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      setError("Card number must be 16 digits");
      return false;
    }
    if (!cardName.trim()) {
      setError("Cardholder name is required");
      return false;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setError("Expiry must be MM/YY");
      return false;
    }
    if (!cvc.match(/^\d{3,4}$/)) {
      setError("CVC must be 3-4 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateInputs()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await fetch("/api/add-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credits: selectedPackage?.credits,
      }),
    });

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setDialogOpen(false);
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvc("");
      setSuccess(false);
    }, 2000);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16) {
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      const formatted = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setExpiry(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  return (
    <AppNav>
      <main className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold flex gap-3 items-center">
            <CreditCard className="h-8 w-8" />
            Load balance
          </h1>
          <p className="text-muted-foreground mt-2">Choose a package and add credits to your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.credits} className="relative overflow-hidden">
              {pkg.discount > 0 && (
                <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                  Save {pkg.discount}%
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.credits} credit{pkg.credits !== 1 ? "s" : ""}</CardTitle>
                <CardDescription>€{pkg.price.toFixed(2)}</CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() => handlePackageSelect(pkg)}
                  className="w-full"
                  variant="default"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            {success ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle>Payment successful</DialogTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {selectedPackage?.credits} credits added to your account
                </p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Payment details</DialogTitle>
                  <DialogDescription>
                    {selectedPackage?.credits} credits for €{selectedPackage?.price.toFixed(2)}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                      <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cardholder name</label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e: any) => setCardName(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry</label>
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <Input
                        placeholder="123"
                        value={cvc}
                        onChange={handleCvcChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Pay now"}
                  </Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </AppNav>
  );
}