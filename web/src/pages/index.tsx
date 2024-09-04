import BannerCard from '@components/common/banner-card';
import Container from '@components/ui/container';
import BrandGridBlock from '@containers/brand-grid-block';
import CategoryBlock from '@containers/category-block';
import { getLayout } from '@components/layout/layout';
import BannerWithProducts from '@containers/banner-with-products';
import BannerBlock from '@containers/banner-block';
import Divider from '@components/ui/divider';
import DownloadApps from '@components/common/download-apps';
import Support from '@components/common/support';
import Instagram from '@components/common/instagram';
import ProductsFlashSaleBlock from '@containers/product-flash-sale-block';
import ProductsFeatured from '@containers/products-featured';
import BannerSliderBlock from '@containers/banner-slider-block';
import ExclusiveBlock from '@containers/exclusive-block';
import Subscription from '@components/common/subscription';
import NewArrivalsProductFeed from '@components/product/feeds/new-arrivals-product-feed';
import { ROUTES } from '@lib/routes';
import {
  masonryBanner,
  promotionBanner,
  modernDemoBanner as banner,
  modernDemoProductBanner as productBanner,
  homeElegantHeroSlider,
  elegantHomeBanner,
} from '@data/static/banners';
import HeroSlider from '@containers/hero-slider';
import TestimonialCarousel from '@containers/testimonial-carousel';

export { getStaticProps } from '@framework/homepage/modern';

export default function Home() {
  return (
    <>
     {/* <HeroSlider
        data={homeElegantHeroSlider}
        paginationPosition="left"const router = useRouter();
        buttonClassName="block"
        variant="fullWidth"
        variantRounded="default"
        buttonPosition="inside"
      /> */}
      
      <div >
      
        <video className=" w-full h-[500px] object-cover" muted={true} playsInline={true} preload="none" autoPlay={true} loop={true}>
          <source type="video/mp4" src="https://cdn.shopify.com/videos/c/o/v/8c6b20552cfd4d7aa9345c01cdcbb320.mp4" /></video></div>
      {/* <BannerBlock data={masonryBanner} /> */}
     <Container className='mt-4'>
      <ExclusiveBlock />
      <CategoryBlock
          sectionHeading="text-shop-by-category"
          variant="rounded"
        />
        </Container>
      <Container className='mt-4'>
        {/* <ProductsFlashSaleBlock /> */}
      </Container>
      <BannerSliderBlock data={promotionBanner} />
      <Container>
       
        
       
        {/* <BrandGridBlock sectionHeading="text-top-brands" /> */}
        {/* <BannerCard
          data={banner[1]}
          href={`${ROUTES.COLLECTIONS}/${banner[1].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
          classNameInner="aspect-[4.3/1]"
        /> */}
        <BannerWithProducts
          sectionHeading="text-on-selling-products"
          categorySlug="/search"
          data={productBanner}
        />
       
        {/* <BannerCard
          data={elegantHomeBanner}
          href={`${ROUTES.COLLECTIONS}/${elegantHomeBanner.slug}`}
          className="mb-12 md:mb-14 xl:mb-16 pb-0.5 md:pb-0 lg:pb-1 xl:pb-0 md:-mt-2.5"
          classNameInner="aspect-[2/1] md:aspect-[2.9/1]"
        /> */}
        {/* <ProductsFeatured
          sectionHeading="text-featured-products"
          variant="flat"
          limit={6}
        /> */}
        {/* <NewArrivalsProductFeed /> */}
        {/* <TestimonialCarousel sectionHeading="text-testimonial" /> */}
        {/* <DownloadApps /> */}
        <Support />
        <Instagram />
       
        <Subscription className="px-5 py-12 bg-opacity-0 sm:px-16 xl:px-0 md:py-14 xl:py-16" />
      </Container>
      <Divider className="mb-0" />
    </>
  );
}

Home.getLayout = getLayout;
