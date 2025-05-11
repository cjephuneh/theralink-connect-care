
import { supabase } from "@/integrations/supabase/client";

export interface PaystackInitializeParams {
  email: string;
  amount: number;
  callback_url: string;
  metadata: {
    user_id: string;
    therapist_id?: string;
    description?: string;
  };
}

export interface PaystackVerifyParams {
  reference: string;
}

export interface WithdrawParams {
  user_id: string;
  amount: number;
  therapist_id: string;
  appointment_id?: string;
}

export class PaystackService {
  static async initializeTransaction(params: PaystackInitializeParams) {
    try {
      const { data, error } = await supabase.functions.invoke('paystack', {
        body: {
          action: 'initialize_transaction',
          data: params,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error initializing transaction:", error);
      throw error;
    }
  }

  static async verifyTransaction(params: PaystackVerifyParams) {
    try {
      const { data, error } = await supabase.functions.invoke('paystack', {
        body: {
          action: 'verify_transaction',
          data: params,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error verifying transaction:", error);
      throw error;
    }
  }

  static async makePaymentToTherapist(params: WithdrawParams) {
    try {
      const { data, error } = await supabase.functions.invoke('paystack', {
        body: {
          action: 'withdraw',
          data: params,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error making payment:", error);
      throw error;
    }
  }
}
