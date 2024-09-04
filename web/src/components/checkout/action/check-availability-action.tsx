import { formatOrderedProduct } from "@lib/format-ordered-product";
import { useState } from "react";
import ValidationError from "@components/ui/validation-error";
import { useVerifyCheckout } from "@framework/checkout";
import { useAtom } from "jotai";
import {
  billingAddressAtom,
  shippingAddressAtom,
  verifiedResponseAtom,
} from "@store/checkout";
import Button from "@components/ui/button";
import { useCart } from "@store/quick-cart/cart.context";
import { useTranslation } from "next-i18next";

export const CheckAvailabilityAction: React.FC<{
  className?: string;
  children?: React.ReactNode;
  orderData?:any
}> = (props) => {
  const { t } = useTranslation("common");
  const [billing_address] = useAtom(billingAddressAtom);
  const [shipping_address] = useAtom(shippingAddressAtom);
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);

  const [errorMessage, setError] = useState("");
  const { items, total, isEmpty } = useCart();
  const orderData=props?.orderData

  const {
    mutate: verifyCheckout,
    isLoading: loading,
  } = useVerifyCheckout();

  function handleVerifyCheckout() {
    console.info(orderData);
    if(!orderData.customer_contact) {
      setError(t('common:contact-number-required'));
      return;
    }

    if(!orderData.customer_name) {
      setError(t('common:name-required'));
      return;
    }

    if(!orderData.customer_email) {
      setError(t('common:email-required'));
      return;
    }

    if(!orderData.address.country) {
      setError(t('common:country-required'));
      return;
    }

    if(!orderData.address.city) {
      setError(t('common:city-required'));
      return;
    }

    if(!orderData.address.street_address) {
      setError(t('common:street_address-required'));
      return;
    }
    
      verifyCheckout(
        {
          amount: total,
          products: items?.map((item) => formatOrderedProduct(item)),
          billing_address: {
            ...(orderData?.address && orderData.address),
          },
          shipping_address: {
            ...(orderData?.address && orderData.address),
          },
        },
        {
          onSuccess: (data:any) => {
            setVerifiedResponse(data);
          },
          onError: (error: any) => {
            setError(error?.response?.data?.message);
          },
        }
      );
    
  }

  return (
    <>
      <Button
        loading={loading}
        className="w-full"
        onClick={handleVerifyCheckout}
        disabled={isEmpty}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={t(errorMessage)} />
        </div>
      )}
    </>
  );
};
