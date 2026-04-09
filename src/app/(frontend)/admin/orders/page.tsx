import { AdminRepository } from "@/lib/admin-repository";
import { toPlainJson } from "@/lib/toPlainJson";
import { OrdersClient, type OrderRow } from "./OrdersClient";

const OrdersPage = async () => {
  const orders = toPlainJson(
    await AdminRepository.find<OrderRow>("orders", {}, { sort: { createdAt: -1 } })
  );

  return (
    <OrdersClient orders={orders} />
  );
};

export default OrdersPage;
