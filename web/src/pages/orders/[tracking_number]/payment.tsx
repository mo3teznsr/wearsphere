import { getLayout } from '@components/layout/layout';
import NewOrder from '@components/orders/new-order';
import DefaultSeo from '@components/common/default-seo';
import { useEffect } from 'react';
import { PaymentStatus, OrderStatus } from '@type/index';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useOrder } from '@framework/orders';
import { useRouter } from 'next/router';
import { useUI } from '@contexts/ui.context';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export { getServerSideProps } from '@framework/order.ssr';

export default function OrderPage() {
  const { t } = useTranslation();
  const { setModalView, setModalData, openModal } = useUI();
  const { query } = useRouter();
  const { data, isLoading, isFetching } = useOrder({
    tracking_number: query.tracking_number as string,
  });

  // @ts-ignore
  const { payment_status, payment_intent, tracking_number, order_status } = data ?? {};

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
    if(payment_status == PaymentStatus.SUCCESS) toast.success(t('payment-successful'));
  }, [payment_status, payment_intent?.payment_intent_info]);

  if (isLoading) {
    <div className="flex items-center justify-center w-full h-full">
      <Spinner showText={false} />
    </div>;
  }

  return (
    <>
      <DefaultSeo noindex={true} nofollow={true} />
      <NewOrder />
    </>
  );
}


OrderPage.getLayout = getLayout;
