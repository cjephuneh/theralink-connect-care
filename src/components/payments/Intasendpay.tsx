import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    IntaSend?: new (options: IntaSendOptions) => IntaSendInstance;
    setup?: () => void;
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
  on: (
    event: "COMPLETE" | "FAILED" | "IN-PROGRESS",
    callback: (results: IntaSendResult) => void
  ) => void;
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
  onFailed,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Create a script element to add the IntaSend script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/intasend-inlinejs-sdk@4.0.7/build/intasend-inline.js";
    script.async = true;

    // When the script loads successfully
    script.onload = () => {
      if (window.IntaSend) {
        console.log("IntaSend script loaded successfully.");
        const inta = new window.IntaSend({
          // Replace with your actual publishable key
          publicAPIKey: import.meta.env.VITE_INTASEND_PUBLISHABLE_KEY,
          live: false,
        });

        // Set up event listeners
        inta.on("COMPLETE", (results) => {
          console.log("Payment Completed", results);
          onComplete(results);
        });

        inta.on("FAILED", (results) => {
          console.log("Payment Failed", results);
          onFailed(results);
        });

        inta.on("IN-PROGRESS", (results) => {
          console.log("Payment In Progress", results);
        });

        // Set up the button event listener for the IntaSend setup
        if (buttonRef.current) {
          console.log("Button ref is set. Setting up IntaSend...");
          buttonRef.current.addEventListener('click', () => {
            console.log("Button clicked. Calling window.setup.");
            window.setup?.();
          });
        }
      } else {
        console.error("IntaSend library did not load properly.");
      }
    };

    // Append the script to the document body
    document.body.appendChild(script);

    // Clean up by removing the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [onComplete, onFailed]);

  return (
    <div className="p-4 border rounded-md mt-4">
      <button
        ref={buttonRef}
        className="intaSendPayButton bg-primary text-white px-4 py-2 rounded"
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

export default IntasendPay;