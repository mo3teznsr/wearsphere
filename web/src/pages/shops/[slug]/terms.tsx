import Subscription from '@components/common/subscription';
import { getLayout } from '@components/layout/layout';
import ShopsSingleDetails from '@components/shops/shops-single-details';
import Button from '@components/ui/button';
import Container from '@components/ui/container';
import ErrorMessage from '@components/ui/error-message';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useTermsAndConditions } from '@framework/terms-and-conditions';
import { Shop } from '@type/index';
import { useTranslation } from 'react-i18next';
import { Element, Link } from 'react-scroll';
import TermsAndConditions from '@components/shops/terms';
import { useSettings } from '@framework/settings';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '@lib/routes';
export {
  getStaticPaths,
  getStaticProps,
} from '@framework/terms-and-conditions.ssr';

export default function ShopDetailsPage({ data }: Shop) {
  const router = useRouter();
  const { id, slug } = data.shop;
  const {
    termsAndConditions,
    isLoading,
    error,
    loadMore,
    hasNextPage,
    isLoadingMore,
  } = useTermsAndConditions(
    {
      shop_id: id,
      limit: 10,
      orderBy: 'created_at',
      sortedBy: 'DESC',
    },
    {
      enable: Boolean(id),
    }
  );
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const isEnableTermsRoute = settings?.options?.enableTerms;

  useEffect(() => {
    if (!isEnableTermsRoute) {
      router.replace(ROUTES.SHOP_URL(slug));
    }
  }, [settings, slug, settingsLoading]);

  if (error) return <ErrorMessage message={error?.message} />;
  return (
    <div className="border-t border-gray-300">
      {data?.shop && (
        <ShopsSingleDetails data={data.shop}>
          <TermsAndConditions
            hasNextPage={Boolean(hasNextPage)}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            loadMore={loadMore}
            terms={termsAndConditions}
          />
        </ShopsSingleDetails>
      )}
      <Container>
        <Subscription />
      </Container>
    </div>
  );
}

ShopDetailsPage.getLayout = getLayout;
