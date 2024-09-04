import NotFound from "@components/404/not-found";
import { getLayout } from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import WishlistItem from "@components/my-account/wishlist-item";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { useWishlist } from "@framework/wishlist";
import { useTranslation } from "react-i18next";
export { getStaticProps } from '@framework/common.ssr';

export default function Wishlists() {
  const { t } = useTranslation('common');
  const { wishlists, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useWishlist({
      limit: 10,
      orderBy: 'created_at',
      sortedBy: 'desc',
    });

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <AccountLayout>
        {isLoading ? (
          <Spinner showText={false} />
        ) : (
          <>
            {!wishlists?.length && !isLoading ? (
              <NotFound
                text="text-no-wishlist-found"
                className="mx-auto w-full md:w-7/12"
              />
            ) : (
              <>
                <div className="flex w-full flex-col h-full">
                  <div className="mb-8 flex items-center">
                    <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading">
                      {t('text-my-wishlist')}
                    </h2>
                  </div>
                  <div className="h-full overflow-x-hidden overflow-y-scroll relative">
                    <div className="divide-y divide-solid divide-[#E6E6E6] space-y-8 group">
                      {wishlists?.map((item: any, index: number) => (
                        <WishlistItem key={index} product={item} />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="mt-8 flex w-full justify-center">
                        <Button
                          loading={isLoadingMore}
                          disabled={isLoadingMore}
                          onClick={loadMore}
                        >
                          {t('text-load-more')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </AccountLayout>
    </>
  );
}

Wishlists.authenticate = true;
Wishlists.getLayout = getLayout;