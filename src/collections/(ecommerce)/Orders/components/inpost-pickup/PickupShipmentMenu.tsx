import { type Order } from "@/types/cms";

import { PickupShipmentMenuClient } from "./PickupShipmentMenu.client";

export const PickupShipmentMenu = ({ data }: { data: Order }) => {
  return <PickupShipmentMenuClient orderID={data.id} />;
};


