import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminOrdersService } from "@/services";
import { useEffect, useState } from "react";

function statusBadgeClass(status) {
  if (status === "paid" || status === "confirmed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "pending") {
    return "bg-amber-50 text-amber-700";
  }
  return "bg-secondary text-secondary-foreground";
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const response = await fetchAdminOrdersService();
    if (response?.success) setOrders(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.courseTitle}
                    </TableCell>
                    <TableCell>
                      {order.userName}
                      <div className="text-xs text-muted-foreground">
                        {order.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>${order.coursePricing}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
