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
  onComplete: (res: IntaSendResult) => void;
  onFailed: (res: IntaSendResult) => void;
}

const IntasendPay: React.FC<IntaSendPayProps> = ({
  amount,
  email,
  firstName,
  lastName,
  onComplete,
  onFailed
}) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.intasend.com/js/intasend-inline.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.IntaSend) {
        const inta = new window.IntaSend({
          publicAPIKey: import.meta.env.VITE_INTASEND_PUBLIC_KEY as string,
          live: false,
        });

        inta.on("COMPLETE", onComplete);
        inta.on("FAILED", onFailed);
        inta.on("IN-PROGRESS", (res) => {
          console.log("⏳ Payment In Progress", res);
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, email, firstName, lastName]);

  return (
    <div className="p-4 border rounded-md mt-4">
      <button
        className="intaSendPayButton bg-primary text-white px-4 py-2 rounded"
        data-amount={amount}
        data-currency="KES"
        data-email={email}
        data-first_name={firstName}
        data-last_name={lastName}
        data-country="KE"
      >
        Pay with IntaSend
      </button>
    </div>
  );
};

export default IntasendPay;