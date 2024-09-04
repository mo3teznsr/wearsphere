import { useAtom } from "jotai";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import { verifiedResponseAtom } from "@store/checkout";

const UnverifiedItemList = dynamic(
  () => import("@components/checkout/item/unverified-item-list")
);
const VerifiedItemList = dynamic(
  () => import("@components/checkout/item/verified-item-list")
);

export const RightSideView = ({orderData}:any) => {
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  if (isEmpty(verifiedResponse)) {
    return <UnverifiedItemList orderData={orderData} />;
  }
  return <VerifiedItemList orderData={orderData} className="border border-gray-300 rounded-md bg-white" />;
};

export default RightSideView;
