import { useEffect } from "react";

declare global {
  interface Window {
    IntaSend?: new (options: IntaSendOptions) => IntaSendInstance;
  }
}

interface IntaSendOptions {
  publicAPIKey: string;
  live: boolean;
}

interface IntaSendResult {
  status: string;
  reference: string;
  phone_number?: string;
  amount?: number;
  payment_method?: string;
  [key: string]: unknown;
}

interface IntaSendInstance {
  on: (event: "COMPLETE" | "FAILED" | "IN-PROGRESS", callback: (results: IntaSendResult) => void) => void;
}

interface IntaSendPayProps {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
}

const IntaSendPay: React.FC<IntaSendPayProps> = ({
  amount,
  email,
  firstName,
  lastName,
}) => {
  useEffect(() => {
    if (window.IntaSend) {
      const inta = new window.IntaSend({
        publicAPIKey: import.meta.env.VITE_INTASEND_PUBLIC_KEY as string,
        live: false,
      });

      inta.on("COMPLETE", (results) => {
        console.log("✅ Payment Complete:", results);
        // Optional: Update Supabase, redirect, etc.
      });

      inta.on("FAILED", (results) => {
        console.error("❌ Payment Failed:", results);
      });

      inta.on("IN-PROGRESS", (results) => {
        console.log("⏳ Payment In Progress:", results);
      });
    }
  }, []);

  return (
    <div>
      <button
        className="intaSendPayButton"
        data-amount={amount}
        data-currency="KES"
        data-email={email}
        data-first_name={firstName}
        data-last_name={lastName}
        data-country="KE"
      >
        Pay Now
      </button>
    </div>
  );
};

export default IntaSendPay;
