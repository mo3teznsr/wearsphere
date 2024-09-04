import { useTranslation } from 'next-i18next';
import { billingAddressAtom, shippingAddressAtom } from '@store/checkout';
import dynamic from 'next/dynamic';
import { useUser } from '@framework/auth';
import { AddressType } from '@framework/utils/constants';
import { getLayout } from '@components/layout/layout';
import { Address } from '@type/index';
import Divider from '@components/ui/divider';
import Container from '@components/ui/container';
import Subscription from '@components/common/subscription';
import OrderNote from '@components/checkout/order-note';

export { getStaticProps } from '@framework/common.ssr';

const ScheduleGrid = dynamic(
  () => import('@components/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(() => import('@components/checkout/address-grid'));
const ContactGrid = dynamic(
  () => import('@components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@components/checkout/right-side-view')
);

export default function CheckoutPage() {
  const { me, loading } = useUser();
  const { t } = useTranslation();
  return (
    <>
      {!loading ? (
        <>
          <Divider className="mb-0" />
          <Container>
            <div className="py-8 lg:py-10 xl:py-14 max-w-[1280px] mx-auto">
              <div className="flex flex-col items-center w-full m-auto lg:flex-row lg:items-start lg:space-x-7 xl:space-x-12 rtl:space-x-reverse">
                <div className="w-full space-y-6">
                  <ContactGrid
                    className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7"
                    //@ts-ignore
                    userId={me?.id!}
                    profileId={me?.profile?.id!}
                    contact={me?.profile?.contact!}
                    label={t('text-contact-number')}
                    count={1}
                  />

                  <AddressGrid
                    userId={me?.id!}
                    className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7"
                    label={t('text-billing-address')}
                    count={2}
                    //@ts-ignore
                    addresses={me?.address?.filter(
                      (address: Address) =>
                        address?.type === AddressType.Billing
                    )}
                    atom={billingAddressAtom}
                    type={AddressType.Billing}
                  />
                  <AddressGrid
                    userId={me?.id!}
                    className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7"
                    label={t('text-shipping-address')}
                    count={3}
                    //@ts-ignore
                    addresses={me?.address?.filter(
                      (address: Address) =>
                        address?.type === AddressType.Shipping
                    )}
                    atom={shippingAddressAtom}
                    type={AddressType.Shipping}
                  />
                  <ScheduleGrid
                    className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7"
                    label={t('text-delivery-schedule')}
                    count={4}
                  />
                  <OrderNote count={5} label={t('Order Note')} className="p-5 bg-white border border-gray-100 rounded-md shadow-checkoutCard md:p-7" />
                </div>
                <div className="w-full lg:w-[320px] xl:w-[440px] flex-shrink-0 mt-10 sm:mt-12 lg:mt-0">
                  <RightSideView />
                </div>
              </div>
            </div>
            <Subscription />
          </Container>
        </>
      ) : (
        ''
      )}
    </>
  );
}

CheckoutPage.authenticate = true;
CheckoutPage.getLayout = getLayout;
