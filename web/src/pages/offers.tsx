import NotFound from '@components/404/not-found';
import Subscription from '@components/common/subscription';
import { getLayout } from '@components/layout/layout';
import Button from '@components/ui/button';
import CouponCard from '@components/ui/cards/coupon';
import Container from '@components/ui/container';
import ErrorMessage from '@components/ui/error-message';
import CouponLoader from '@components/ui/loaders/coupon-loader';
import PageHeader from '@components/ui/page-header';
import { useCoupons } from '@framework/coupons';
import rangeMap from '@lib/range-map';
import { Coupon } from '@type/index';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
export { getStaticProps } from '@framework/coupons.ssr';

export default function OffersPage() {
  const { t } = useTranslation('common');
  const limit = 20;
  const { isLoading, isLoadingMore, hasMore, coupons, error, loadMore } =
    useCoupons({ limit });
  const isValidCoupon = coupons.filter(
    (item: Coupon) => Boolean(item?.is_approve) && Boolean(item?.is_valid),
  );

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <PageHeader pageHeader="text-page-offers" />
      <Container>
        {!isLoading && isEmpty(coupons) ? (
          <NotFound
            text={'text-no-coupon'}
            className="mx-auto w-full md:w-7/12 mt-20"
          />
        ) : (
          <>
            <div className="py-16 lg:py-20">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-8 2xl:grid-cols-6">
                {isLoading && !isValidCoupon?.length ? (
                  rangeMap(6, (i) => (
                    <CouponLoader key={i} uniqueKey={`coupon-${i}`} />
                  ))
                ) : isValidCoupon?.length ? (
                  isValidCoupon?.map((item: Coupon) => (
                    <CouponCard key={item.id} coupon={item} />
                  ))
                ) : (
                  <div className="max-w-2xl mx-auto col-span-full">
                    <NotFound text={'text-no-coupon'} />
                  </div>
                )}
              </div>
              {hasMore && (
                <div className="flex items-center justify-center mt-8 lg:mt-12">
                  <Button onClick={loadMore} loading={isLoadingMore}>
                    {t('text-load-more')}
                  </Button>
                </div>
              )}
            </div>
            <Subscription />
          </>
        )}
      </Container>
    </>
  );
}

OffersPage.getLayout = getLayout;
