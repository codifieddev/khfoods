import { type Order } from "@/types/cms";

import { CourierShipmentMenuClient } from "./CourierShipmentMenu.client";

export const CourierShipmentMenu = ({ data }: { data: Order }) => {
  return <CourierShipmentMenuClient orderID={data.id} />;
};


