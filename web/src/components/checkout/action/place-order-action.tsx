import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateOrder } from '@framework/orders';
import { API_ENDPOINTS } from '@framework/utils/endpoints';

import ValidationError from '@components/ui/validation-error';
import Button from '@components/ui/button';
import isEmpty from 'lodash/isEmpty';
import { formatOrderedProduct } from '@lib/format-ordered-product';
import { useCart } from '@store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { checkoutAtom, discountAtom, walletAtom } from '@store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
  calculateCommission
} from '@store/quick-cart/cart.utils';
import { useTranslation } from 'next-i18next';
import { useUser } from '@framework/auth';
// import { useSettings } from "@contexts/settings.context";

export const PlaceOrderAction: React.FC<{ children: React.ReactNode,orderData?:any }> = (
  props
) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { createOrder, isLoading } = useCreateOrder();
  const [placeOrderLoading, setPlaceOrderLoading] = useState(isLoading);
  const { locale }: any = useRouter();
  const { items } = useCart();
  const { me } = useUser();
  const orderData=props?.orderData

  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      customer_contact,
      customer_name,
      customer_email,
      payment_gateway,
      token,
      note
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);
  const [use_wallet_points] = useAtom(walletAtom);


  useEffect(() => {
    
  }, [orderData]);

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);
  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  // const {
  //   settings: { freeShippingAmount, freeShipping },
  // } = useSettings();
  // let freeShippings = freeShipping && Number(freeShippingAmount) <= subtotal;
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(discount)
  );

  const total_commission=calculateCommission(available_items);

  // place order handle function
  const handlePlaceOrder = () => {
    if (`${orderData?.customer_contact}`.length<5) {
      setErrorMessage(t('common:contact-number-required'));
      return;
    }

    if (!orderData?.customer_name) {
      setErrorMessage(t('common:name-required'));
      return;
    }

    if (!orderData?.customer_email) {
      setErrorMessage(t('common:email-required'));
      return;
    }

    if (!orderData?.address?.country) {
      setErrorMessage(t('common:country-required'));
      return;
    }

    if (!orderData?.address?.city) {
      setErrorMessage(t('common:city-required'));
      return;
    }

    if (!orderData?.address?.street_address) {
      setErrorMessage(t('common:street-required'));
      return;
    }


    if (!payment_gateway) {
      setErrorMessage(t('common:text-gateway-required'));
      return;
    }
    // if (payment_gateway === "STRIPE" && !token) {
    //   setErrorMessage(t("common:text-pay-first"));
    //   return;
    // }
    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      // status: orderStatusData?.orderStatuses?.data[0]?.id ?? "1",
      amount: subtotal,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      total_commission,
      sales_tax: verified_response?.total_tax,
      delivery_fee: verified_response?.shipping_charge,
      total,
      delivery_time: delivery_time?.title,
      customer_contact:orderData?.customer_contact,
      name:orderData?.customer_name ,
      customer_email:orderData?.customer_email ,
      note,
      use_wallet_points,
      payment_gateway,
      billing_address: {
        ...(orderData?.address && orderData.address),
      },
      shipping_address: {
        ...(orderData?.address && orderData.address),
      },
    };
    // if (payment_gateway === "STRIPE") {
    //   //@ts-ignore
    //   input.token = token;
    // }
console.info(input)
    delete input.billing_address.__typename;
    delete input.shipping_address.__typename;
    createOrder(input);
  };

  const isAllRequiredFieldSelected = [
    orderData.customer_contact,
    payment_gateway,
    available_items,
  ].every((item) => !isEmpty(item));

  return (
    <div className="px-6">
      <Button
        loading={isLoading}
        className="w-full my-5"
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected}
        {...props}
      />
      {errorMessage && (
        <div className="my-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};
