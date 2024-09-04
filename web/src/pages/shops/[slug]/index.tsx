import Container from '@components/ui/container';
import { getLayout } from '@components/layout/layout';
import Subscription from '@components/common/subscription';
import ShopsSingleDetails from '@components/shops/shops-single-details';
import ShopProductsGrid from '@components/shops/shop-products-grid';
import { Shop } from '@type/index';
export { getStaticPaths, getStaticProps } from '@framework/shop.ssr';

export default function ShopDetailsPage({ data }: Shop) {
  return (
    <div className="border-t border-gray-300">
      {data?.shop && (
        <ShopsSingleDetails data={data.shop}>
          <ShopProductsGrid shopId={data?.shop?.id} />
        </ShopsSingleDetails>
      )}
      <Container>
        <Subscription />
      </Container>
    </div>
  );
}

ShopDetailsPage.getLayout = getLayout;
