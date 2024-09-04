import { getLayout } from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import MyDownloads from '@components/my-account/my-downloads';
import ErrorMessage from '@components/ui/error-message';
import { useDownloadableProducts } from '@framework/orders';
export { getStaticProps } from '@framework/common.ssr';

export default function AccountPage() {
  const { downloads, error, loadMore, isLoading, isLoadingMore, hasMore } =
    useDownloadableProducts({
      limit: 10,
      orderBy: 'created_at',
    });

  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <AccountLayout>
      <MyDownloads
        downloads={downloads}
        hasMore={hasMore}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        loadMore={loadMore}
      />
    </AccountLayout>
  );
}

AccountPage.authenticate = true;
AccountPage.getLayout = getLayout;
