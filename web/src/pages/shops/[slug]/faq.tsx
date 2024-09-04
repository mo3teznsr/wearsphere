import Subscription from '@components/common/subscription';
import { getLayout } from '@components/layout/layout';
import ShopsSingleDetails from '@components/shops/shops-single-details';
import Container from '@components/ui/container';
import { Shop } from '@type/index';
import { useFAQs } from '@framework/faq';
import ErrorMessage from '@components/ui/error-message';
import FAQAccordion from '@components/shops/faq';
export { getStaticPaths, getStaticProps } from '@framework/faq.ssr';

export default function ShopDetailsPage({ data }: Shop) {
  const { faqs, isLoading, error, loadMore, hasNextPage, isLoadingMore } =
    useFAQs({
      faq_type: 'shop',
      issued_by: data?.shop?.name,
      shop_id: data?.shop?.id,
      limit: 6,
      orderBy: 'created_at',
      sortedBy: 'DESC',
    });

  if (error) return <ErrorMessage message={error?.message} />;
  return (
    <div className="border-t border-gray-300">
      {data?.shop && (
        <ShopsSingleDetails data={data.shop}>
          <FAQAccordion
            faqs={faqs}
            isLoading={isLoading}
            loadMore={loadMore}
            hasNextPage={Boolean(hasNextPage)}
            isLoadingMore={isLoadingMore}
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
