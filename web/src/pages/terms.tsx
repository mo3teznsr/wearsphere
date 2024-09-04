import { getLayout } from '@components/layout/layout';
import TermsAndConditions from '@components/shops/terms';
import Container from '@components/ui/container';
import ErrorMessage from '@components/ui/error-message';
import PageHeader from '@components/ui/page-header';
import { useTermsAndConditions } from '@framework/terms-and-conditions';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import client from '@framework/utils/index';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';

export default function TermsPage() {
  const {
    termsAndConditions,
    isLoading,
    error,
    loadMore,
    hasNextPage,
    isLoadingMore,
  } = useTermsAndConditions({
    issued_by: 'Super Admin',
    limit: 10,
    orderBy: 'created_at',
    sortedBy: 'DESC',
  });
  if (error) return <ErrorMessage message={error?.message} />;
  return (
    <>
      <PageHeader pageHeader="text-page-terms-of-service" />
      <div className="mt-12 lg:mt-14 xl:mt-16 lg:py-1 xl:py-0 border-b border-gray-300 px-4 md:px-10 lg:px-7 xl:px-16 2xl:px-24 3xl:px-32 pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24">
        <Container>
          <TermsAndConditions
            hasNextPage={Boolean(hasNextPage)}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            loadMore={loadMore}
            terms={termsAndConditions}
          />
        </Container>
      </div>
    </>
  );
}

TermsPage.getLayout = getLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(API_ENDPOINTS.SETTINGS, () =>
    client.settings.findAll()
  );
  await queryClient.prefetchQuery(API_ENDPOINTS.TERMS_AND_CONDITIONS, () =>
    client.termsAndConditions.all({
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
        'terms',
      ])),
    },
  };
};
