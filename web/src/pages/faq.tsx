import Subscription from '@components/common/subscription';
import { getLayout } from '@components/layout/layout';
import FAQAccordion from '@components/shops/faq';
import Container from '@components/ui/container';
import ErrorMessage from '@components/ui/error-message';
import PageHeader from '@components/ui/page-header';
import { useFAQs } from '@framework/faq';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import client from '@framework/utils/index';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';

export default function FAQ() {
  const { faqs, isLoading, error, loadMore, hasNextPage, isLoadingMore } =
    useFAQs({
      faq_type: 'global',
      issued_by: 'Super Admin',
      limit: 10,
      orderBy: 'created_at',
      sortedBy: 'DESC',
    });
  if (error) return <ErrorMessage message={error?.message} />;
  return (
    <>
      <PageHeader pageHeader="text-page-faq" />
      <Container>
        <FAQAccordion
          faqs={faqs}
          isLoading={isLoading}
          loadMore={loadMore}
          hasNextPage={Boolean(hasNextPage)}
          isLoadingMore={isLoadingMore}
        />
        <Subscription />
      </Container>
    </>
  );
}

FAQ.getLayout = getLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(API_ENDPOINTS.SETTINGS, () =>
    client.settings.findAll()
  );
  await queryClient.prefetchQuery(API_ENDPOINTS.FAQS, () =>
    client.faqs.all({
      faq_type: 'global',
      issued_by: 'Super Admin',
      limit: 10,
      orderBy: 'created_at',
      sortedBy: 'DESC',
    })
  );

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'menu',
        'forms',
        'footer',
        'faq',
      ])),
    },
  };
};
