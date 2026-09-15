import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        const response = await captureAndFinalizePaymentService(
          paymentId,
          payerId,
          orderId
        );

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }

      capturePayment();
    }
  }, [payerId, paymentId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <CardTitle>Processing payment... Please wait</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalPaymentReturnPage;
