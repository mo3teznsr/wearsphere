import DefaultSeo from "@components/common/default-seo";
import { getLayout } from "@components/layout/layout";
import MyCards from '@components/card/my-cards';
import { useSettings } from '@framework/settings';
// import { PaymentGateway } from '@type/index';
import Spinner from '@components/ui/loaders/spinner/spinner';
import AccountLayout from '@components/my-account/account-layout';
import { isStripeAvailable } from '@lib/is-stripe-available';

export { getStaticProps } from '@framework/common.ssr';

const FeatureNotAvailable = () => {
  return (
    <div className="block text-sm font-semibold text-black">
      Sorry this feature is not available!
    </div>
  );
};

const MyCardsPage = () => {
  let { data, isLoading } = useSettings();
  const isStripeGatewayAvailable = isStripeAvailable(data?.options);
  const isPaymentEnable = data?.options.useEnableGateway ?? true;
  
  if (!isStripeGatewayAvailable || !isPaymentEnable) {
    return (
      <AccountLayout>
        <FeatureNotAvailable />
      </AccountLayout>
    );
  }

  return (
    <>
      <AccountLayout>
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <Spinner showText={false} className="!h-full" />
          </div>
        ) : (
          <>
            <DefaultSeo noindex={true} nofollow={true} />
            <MyCards />
          </>
        )}
      </AccountLayout>
    </>
  );
};

MyCardsPage.authenticate = true;
MyCardsPage.getLayout = getLayout;

export default MyCardsPage;
