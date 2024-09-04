import Container from '@components/ui/container';
import { getLayout } from '@components/layout/layout';
import Subscription from '@components/common/subscription';
import ProductSingleDetails from '@components/product/product-single-details';
import Divider from '@components/ui/divider';
import Breadcrumb from '@components/common/breadcrumb';
import { useRouter } from 'next/router';
import Spinner from '@components/ui/loaders/spinner/spinner';
import dynamic from 'next/dynamic';
import {
  adminOwnerAndStaffOnly,
  getAuthCredentials,
  hasAccess,
} from '@lib/auth-utils';
import AccessDeniedPage from '@components/common/access-denied';

export { getStaticPaths, getStaticProps } from '@framework/product.ssr';

const RelatedProducts = dynamic(() => import('@containers/related-products'));

export default function ProductPage({ product }: any) {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const AccessAdminRoles = hasAccess(adminOwnerAndStaffOnly, permissions);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <Spinner />;
  }

  return AccessAdminRoles ? (
    <>
      <Divider className="mb-0" />
      <Container>
        <div className="pt-8">
          <Breadcrumb />
        </div>
        <ProductSingleDetails product={product} />
        <RelatedProducts
          products={product?.related_products}
          currentProductId={product?.id}
          sectionHeading="text-related-products"
        />
        <Subscription />
      </Container>
    </>
  ) : (
    <AccessDeniedPage />
  );
}
ProductPage.authenticate = true;
ProductPage.getLayout = getLayout;
