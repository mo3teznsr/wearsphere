import NewOrder from "@components/orders/new-order";
import { getLayout } from "@components/layout/layout";
import { useRouter } from "next/router";
import { useOrder } from '@framework/orders';
import PageLoader from "@components/ui/page-loader/page-loader";
import { PaymentStatus, OrderStatus } from '@type/index';
import { useEffect } from 'react';
import { useUI } from '@contexts/ui.context';

export { getStaticPaths, getStaticProps } from '@framework/order.ssr';

export default function OrderPage() {
  const router = useRouter();
  const { query } = router;
  const { setModalView, setModalData, openModal } = useUI();
  const { data, isLoading, isFetching } = useOrder({
    tracking_number: query.tracking_number as string,
  });

  // @ts-ignore
  const { payment_status, payment_intent, tracking_number, order_status } =
    data ?? {};

  const isPaymentModalEnabled =
    order_status !== OrderStatus?.CANCELLED &&
    payment_status === PaymentStatus.PENDING &&
    payment_intent?.payment_intent_info &&
    !payment_intent?.payment_intent_info?.is_redirect;

  useEffect(() => {
    if (isPaymentModalEnabled) {
      setModalData({
        paymentGateway: payment_intent?.payment_gateway,
        paymentIntentInfo: payment_intent?.payment_intent_info,
        trackingNumber: tracking_number,
      });
      setModalView('PAYMENT_MODAL');
      return openModal();
    }
  }, [payment_status, payment_intent?.payment_intent_info]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <PageLoader />;
  }

  return <NewOrder />;
}


OrderPage.getLayout = getLayout;
