import BannerCard from '@components/common/banner-card';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import { ROUTES } from '@lib/routes';
import { StaticBanner } from '@type/index';
import { useTags } from '@framework/tags';
import { useMemo } from 'react';
import Container from '@components/ui/container';
import CollectionProductsBlock from './collection-products-block';

interface BannerProps {
  data: StaticBanner[];
  className?: string;
}

const breakpoints = {
  '0': {
    slidesPerView: 2,
  },
};

const BannerSliderBlock: React.FC<BannerProps> = ({
  className = 'mb-12 md:mb-14 xl:mb-16',
  data,
}) => {
  const { data:tags} = useTags({});
  const banners= tags?.pages?.[0]?.data?.map((banner:any)=>{
      return {
        ...banner,
    title: banner.name,
    image: {
      mobile: {
        url: banner.image.original,
        width: 450,
        height: 180,
      },
      desktop: {
        url:  banner.image.original,
        width: 1440,
        height: 570,
      },
    },
    type: 'small',
      }
    })

    const random =banners?Math.floor(Math.random() * banners?.length):0

  return (
    <div>
      <Container>
    {tags?.pages?.[0]?.data?.map((collection:any)=><CollectionProductsBlock collection={collection} sectionHeading={collection.name} />)}
    </Container>
    <div className={`${className} mx-auto max-w-[1920px] overflow-hidden`}>
      <div className="-mx-32 sm:-mx-44 lg:-mx-60 xl:-mx-72 2xl:-mx-80">

        
        <Carousel
          breakpoints={breakpoints}
          centeredSlides={true}
          autoplay={{ delay: 4000 }}
          pagination={{
            clickable: true,
          }}
          paginationVariant="circle"
          buttonClassName="hidden"
        >
          {banners?.map((banner: any) => (
            <SwiperSlide
              key={`banner--key${banner.id}`}
              className="px-1.5 md:px-2.5 xl:px-3.5"
            >
              <BannerCard
                data={banner}
                effectActive={true}
                href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
                classNameInner="aspect-[2.55/1]"
              />
            </SwiperSlide>
          ))}
        </Carousel>
        
      </div>
    </div>
    {banners?.[random]&&<Container>
        <BannerCard
          data={banners[random]}
          href={`${ROUTES.COLLECTIONS}/${banners[random].slug}`}
          className="mb-12 lg:mb-14 xl:mb-16 pb-0.5 lg:pb-1 xl:pb-0"
          classNameInner="aspect-[3.15/1]"
        />
        </Container>}
    </div>
  );
};

export default BannerSliderBlock;
