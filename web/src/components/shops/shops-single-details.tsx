import ShopSidebar from '@components/shops/shop-sidebar';
import Container from '@components/ui/container';
import Text from '@components/ui/text';
import { useUI } from '@contexts/ui.context';
import { productPlaceholder } from '@lib/placeholders';
import { Shop } from '@type/index';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback } from 'react';
import StickyBox from 'react-sticky-box';

type Props = {
  data: Shop;
  children: React.ReactNode;
};

const ShopsSingleDetails: React.FC<Props> = ({ data, children }) => {
  const { t } = useTranslation();
  const { openSidebar } = useUI();

  const handleSidebar = useCallback((view: string) => {
    return openSidebar({
      view,
      data,
    });
  }, []);

  return (
    <>
      <div className="flex items-center px-8 py-4 mb-4 border-b border-gray-300 lg:hidden">
        <div className="flex flex-shrink-0">
          <Image
            src={data?.logo?.original! ?? productPlaceholder}
            alt={data?.name}
            width={62}
            height={62}
            className="rounded-md"
          />
        </div>
        <div className="ltr:pl-4 rtl:pr-4">
          <Text variant="heading">{data?.name}</Text>
          <button
            className="text-sm font-semibold transition-all text-heading opacity-80 hover:opacity-100"
            onClick={() => handleSidebar('DISPLAY_SHOP_SINGLE_SIDE_BAR')}
          >
            {t('text-more-info')}
          </button>
        </div>
      </div>
      <Container>
        <div className="flex flex-col pb-16 lg:flex-row lg:pt-7 lg:pb-20">
          <div className="flex-shrink-0 hidden lg:block lg:w-80 xl:w-96">
            <StickyBox offsetTop={50} offsetBottom={20}>
              <ShopSidebar
                data={data}
                className="w-full border border-gray-300 rounded-lg"
              />
            </StickyBox>
          </div>

          <div className="w-full ltr:lg:pl-7 rtl:lg:pr-7">
            {data?.cover_image?.original && (
              <div className="flex mb-4 lg:mb-7">
                <Image
                  src={data?.cover_image?.original!}
                  alt={data?.name}
                  width={2760}
                  height={1020}
                  className="bg-gray-300 rounded-xl"
                />
              </div>
            )}

            {children}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ShopsSingleDetails;
