import Subscription from '@components/common/subscription';
import { getLayout } from '@components/layout/layout';
import ShopsSingleDetails from '@components/shops/shops-single-details';
import Container from '@components/ui/container';
import { Coupon, Shop } from '@type/index';
import ErrorMessage from '@components/ui/error-message';
import { useCoupons } from '@framework/coupons';
import { useTranslation } from 'react-i18next';
import CouponCard from '@components/ui/cards/coupon';
import CouponLoader from '@components/ui/loaders/coupon-loader';
import Button from '@components/ui/button';
import rangeMap from '@lib/range-map';
import { ROUTES } from '@lib/routes';
import { useSettings } from '@framework/settings';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export { getStaticPaths, getStaticProps } from '@framework/faq.ssr';
import NotFound from '@components/404/not-found';

export default function ShopOffersPage({ data }: Shop) {
  const { t } = useTranslation('common');
  const limit = 5;
  const { id, slug } = data.shop;
  const router = useRouter();
  const { data: settings, isLoading: settingsLoading } = useSettings();

  const isEnableCouponsRoute = settings?.options?.enableCoupons;

  useEffect(() => {
    if (!isEnableCouponsRoute) {
      router.replace(ROUTES.SHOP_URL(slug));
    }
  }, [settings, slug, settingsLoading]);

  const { isLoading, isLoadingMore, hasMore, coupons, error, loadMore } =
    useCoupons(
      {
        shop_id: id,
      },
      {
        enable: Boolean(id),
      },
    );

  const isValidCoupon = coupons.filter(
    (item: Coupon) => Boolean(item?.is_approve) && Boolean(item?.is_valid),
  );

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="border-t border-gray-300">
      {data?.shop && (
        <ShopsSingleDetails data={data.shop}>
          <div className="py-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 xl:gap-8 2xl:grid-cols-5">
              {isLoading && !isValidCoupon.length ? (
                rangeMap(limit, (i) => (
                  <CouponLoader key={i} uniqueKey={`coupon-${i}`} />
                ))
              ) : isValidCoupon.length ? (
                isValidCoupon.map((item: Coupon) => (
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
        </ShopsSingleDetails>
      )}
      <Container>
        <Subscription />
      </Container>
    </div>
  );
}

ShopOffersPage.getLayout = getLayout;
