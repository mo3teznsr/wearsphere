import React, { useEffect, useState } from 'react';
import Button from '@components/ui/button';
import Counter from '@components/common/counter';
import { getVariations } from '@framework/utils/get-variations';
import { useCart } from '@store/quick-cart/cart.context';
import usePrice from '@lib/use-price';
import { generateCartItem } from '@utils/generate-cart-item';
import { ProductAttributes } from './product-attributes';
import isEmpty from 'lodash/isEmpty';
import Link from '@components/ui/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useWindowSize } from '@utils/use-window-size';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import { Attachment, Product } from '@type/index';
import isEqual from 'lodash/isEqual';
import VariationPrice from '@components/product/product-variant-price';
import { useTranslation } from 'next-i18next';
import isMatch from 'lodash/isMatch';
import { ROUTES } from '@lib/routes';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Rating from '@mui/material/Rating';
import LinearProgress from '@mui/material/LinearProgress';

const FavoriteButton = dynamic(
  () => import('@components/product/favorite-button'),
  {
    ssr: false,
  }
);
import { useSanitizeContent } from '@lib/sanitize-content';
import RatingsBadge from '@components/ui/rating-badge';
import StarIcon from '@components/icons/star-icon';
import Modal from '@components/common/modal/modal';
import ProductMetaReview from './product-meta-review';
import ReviewForm from '@components/common/form/review-form';
import Avatar from '@components/common/avatar';
import { siteSettings } from '@settings/site.settings';
import moment from 'moment';
import ProgressCard from '@components/common/progress-card';
import Commission from './commission';
import { FaGoogleDrive } from 'react-icons/fa';

const productGalleryCarouselResponsive = {
  '768': {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  '0': {
    slidesPerView: 1,
  },
};

type Props = {
  product: Product;
};

const ProductSingleDetails: React.FC<Props> = ({ product }: any) => {

  const { t } = useTranslation();
  const { width } = useWindowSize();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const toggleShowSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  }
  const { addItemToCart } = useCart();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const variations = getVariations(product?.variations!);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation),
      )
    : true;

  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
  }

  useEffect(() => {
   // setLoaded(true);
  }, []);

  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 600);

    const item = generateCartItem(product!, selectedVariation);
    addItemToCart(item, quantity);
    toast(t('add-to-cart'), {
      //@ts-ignore
      type: 'dark',
      progressClassName: 'fancy-progress-bar',
      position: width > 768 ? 'bottom-right' : 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function handleAttribute(attribute: any) {
    // Reset Quantity
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function handleClearAttribute() {
    setAttributes(() => ({}));
  }

  // Combine image and gallery
  const combineImages = [...product?.gallery, product?.image];
  const variationImage = product.variation_options;
  const content = useSanitizeContent({ description: product?.description });
  return (
    <div className="items-start block grid-cols-9 pb-10 lg:grid gap-x-10 xl:gap-x-14 pt-7 lg:pb-14 2xl:pb-20">
      {width < 1025 ? (
        <Carousel
          pagination={{
            clickable: true,
          }}
          breakpoints={productGalleryCarouselResponsive}
          className="product-gallery"
          buttonClassName="hidden"
        >
          {combineImages?.length > 1 ? (
            <>
              {combineImages?.map((item: Attachment, index: number) => (
                <SwiperSlide key={`product-gallery-key-${index}`}>
                  <div className="relative flex col-span-1 transition duration-150 ease-in hover:opacity-90">
                    <Image
                      width={475}
                      height={618}
                      src={
                        item?.original ??
                        '/assets/placeholder/products/product-gallery.svg'
                      }
                      alt={`${product?.name}--${index}`}
                      className="object-cover w-full"
                    />
                  </div>
                </SwiperSlide>
              ))}
              {variationImage?.map((item: any, index: number) => {
                if (!item?.image?.original) return null;
                return (
                  <SwiperSlide key={`product-gallery-key-${index}`}>
                    <div className="relative flex col-span-1 transition duration-150 ease-in hover:opacity-90">
                      <Image
                        width={475}
                        height={618}
                        src={
                          item?.image?.original ??
                          '/assets/placeholder/products/product-gallery.svg'
                        }
                        alt={`${product?.name}--${index}`}
                        className="object-cover w-full"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </>
          ) : (
            <SwiperSlide key={`product-gallery-key`}>
              <div className="flex col-span-1 transition duration-150 ease-in hover:opacity-90">
                <Image
                  width={475}
                  height={618}
                  src={
                    combineImages?.[0]?.original ??
                    '/assets/placeholder/products/product-gallery.svg'
                  }
                  alt={product?.name}
                  className="object-cover w-full"
                />
              </div>
            </SwiperSlide>
          )}
        </Carousel>
      ) : (
        <div className="col-span-5 grid grid-cols-2 gap-2.5">
          {combineImages?.length > 1 ? (
            <>
              {combineImages?.map((item: Attachment, index: number) => (
                <div
                  key={index}
                  className="flex col-span-1 transition duration-150 ease-in hover:opacity-90"
                >
                  <Image
                    width={475}
                    height={618}
                    src={
                      item?.original ??
                      '/assets/placeholder/products/product-gallery.svg'
                    }
                    alt={`${product?.name}--${index} variations`}
                    className={cn('object-cover w-full')}
                  />
                </div>
              ))}
              {variationImage?.map((item: any, index: number) => {
                if (!item?.image?.original) return null;
                return (
                  <div
                    key={index}
                    className="flex col-span-1 transition duration-150 ease-in hover:opacity-90"
                  >
                    <Image
                      width={475}
                      height={618}
                      src={
                        item?.image?.original ??
                        '/assets/placeholder/products/product-gallery.svg'
                      }
                      alt={`${product?.name}--${index} variations`}
                      className={cn('object-cover w-full')}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex justify-center bg-gray-300 rounded-md col-span-full">
              <div className="flex w-1/2 transition duration-150 ease-in hover:opacity-90">
                <Image
                  width={475}
                  height={618}
                  src={
                    combineImages?.[0]?.original ??
                    '/assets/placeholder/products/product-gallery.svg'
                  }
                  alt={product?.name}
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="col-span-4 pt-8 lg:pt-0">
        <div className="border-b border-gray-300 pb-7">
          <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse mb-2">
            <h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
              {product?.name}
            </h2>
            <div>
              <FavoriteButton productId={product?.id} />
            </div>
          </div>
          {content ? (
            <div
              className="text-sm leading-6 text-body lg:text-base lg:leading-8 react-editor-description"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          ) : (
            ''
          )}

          <div>

          <div className="flex items-center mt-5">
            {!isEmpty(variations) ? (
              <VariationPrice
                selectedVariation={selectedVariation}
                minPrice={product.min_price}
                maxPrice={product.max_price}
              />
            ) : (
              <>
                <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
                  {price}
                </div>

                {basePrice && (
                  <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                    {basePrice}
                  </del>
                )}
              </>
            )}
          </div>

          {isSelected&& <div className='flex gap-1'>
        
        <span>
          <Commission selectedVariation={selectedVariation} commission={product?.commission} />
         </span>
      </div>}
      <div>
        <div className='flex gap-1 cursor-pointer items-center my-2' onClick={()=>window.open(product?.drive, "_blank")}>
          <FaGoogleDrive />
          {t("text-google-drive")}
        </div>
      <div className="mb-2">
          <ProgressCard soldProduct={!isEmpty(variations)?selectedVariation?.sold_quantity:product?.sold_quantity} totalProduct={!isEmpty(variations)?selectedVariation?.quantity:product?.quantity} /> 
          
           </div>
      </div>

         
          </div>
          <div>
            <span className="flex gap-1 items-center">
             
              <Rating  value={product.ratings} disabled  /> <span>{product.ratings} ({product.total_reviews})</span>
            </span>
          </div>
         
        </div>
        
        {!isEmpty(variations) && (
          <div className="pb-3  pt-7">
            {Object.keys(variations).map((variation) => {
              return (
                <ProductAttributes
                  key={variation}
                  title={variation}
                  attributes={variations[variation]}
                  active={attributes[variation]}
                  onClick={handleAttribute}
                  clearAttribute={handleClearAttribute}
                />
              );
            })}
          </div>
        )}

        <div className='flex gap-1 items-center mb-4'>
          <span className='font-semibold'>{t('tips')} :</span>
          <span className='flex gap-1 text-yellow-600  items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-thumb-up-filled" width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" stroke-width="0" fill="currentColor" />
  <path d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" stroke-width="0" fill="currentColor" />
</svg> 90%
          </span>
          <span>{t("text-tips")}</span>
        </div>

        <div className='pb-4 cursor-pointer flex gap-2' onClick={toggleShowSizeGuide}>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-ruler-measure"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 12c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" /><path d="M9 12v2" /><path d="M6 12v3" /><path d="M12 12v3" /><path d="M18 12v3" /><path d="M15 12v2" /><path d="M3 3v4" /><path d="M3 5h18" /><path d="M21 3v4" /></svg>
            <span className=" text-slate-800" >{t("text-size-guide")}</span>
          </div>

        <div className="flex items-center py-8 space-x-4 border-b border-gray-300 rtl:space-x-reverse ltr:md:pr-32 ltr:lg:pr-12 ltr:2xl:pr-32 ltr:3xl:pr-48 rtl:md:pl-32 rtl:lg:pl-12 rtl:2xl:pl-32 rtl:3xl:pl-48">
          {isEmpty(variations) && (
            <>
              {Number(product.quantity) > 0 ? (
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 1}
                  disableIncrement={Number(product.quantity) === quantity}
                />
              ) : (
                <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                  {t('text-out-stock')}
                </div>
              )}
            </>
          )}

          {!isEmpty(selectedVariation) && (
            <>
              {selectedVariation?.is_disable ||
              selectedVariation.quantity === 0 ? (
                <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:lg:mr-7">
                  {t('text-out-stock')}
                </div>
              ) : (
                <Counter
                  quantity={quantity}
                  onIncrement={() => setQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disableDecrement={quantity === 1}
                  disableIncrement={
                    Number(selectedVariation.quantity) === quantity
                  }
                />
              )}
            </>
          )}

          

          <Button
            onClick={addToCart}
            variant="slim"
            className={`w-full md:w-6/12 xl:w-full ${
              !isSelected && 'bg-gray-400 hover:bg-gray-400'
            }`}
            disabled={
              !isSelected ||
              !product?.quantity ||
              product.status.toLowerCase() != 'publish' ||
              (!isEmpty(selectedVariation) && !selectedVariation?.quantity) ||
              (!isEmpty(selectedVariation) && selectedVariation?.is_disable)
            }
            loading={addToCartLoader}
          >
            <span className="py-2 3xl:px-8">
              {product?.quantity ||
              (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                ? t('text-add-to-cart')
                : t('text-out-stock')}
            </span>
          </Button>
        </div>
        <div className="py-6">
          <ul className="pb-1 space-y-5 text-sm">
            {product?.sku && (
              <li>
                <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                  SKU:
                </span>
                {product?.sku}
              </li>
            )}

            {product?.categories &&
              Array.isArray(product.categories) &&
              product.categories.length > 0 && (
                <li>
                  <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                    {t("text-category")}:
                  </span>
                  {product.categories.map((category: any, index: number) => (
                    <Link
                      key={index}
                      href={`${ROUTES.CATEGORY}/${category?.slug}`}
                      className="transition hover:underline hover:text-heading"
                    >
                      {product?.categories?.length === index + 1
                        ? category.name
                        : `${category.name}, `}
                    </Link>
                  ))}
                </li>
              )}

            {product?.tags &&
              Array.isArray(product.tags) &&
              product.tags.length > 0 && (
                <li className="productTags">
                  <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                    {t('text-tags')}:
                  </span>
                  {product.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`${ROUTES.COLLECTIONS}/${tag?.slug}`}
                      className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
                    >
                      {tag.name}
                      <span className="text-heading">,</span>
                    </Link>
                  ))}
                </li>
              )}

            <li>
              <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                {t('text-brand-colon')}
              </span>
              <Link
                href={`${ROUTES.BRAND}=${product?.type?.slug}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {product?.type?.name}
              </Link>
            </li>

            {/* <li>
              <span className="inline-block font-semibold text-heading ltr:pr-2 rtl:pl-2">
                {t('text-shop-colon')}
              </span>
              <Link
                href={`${ROUTES.SHOPS}/${product?.shop?.slug}`}
                className="inline-block ltr:pr-1.5 rtl:pl-1.5 transition hover:underline hover:text-heading ltr:last:pr-0 rtl:last:pl-0"
              >
                {product?.shop?.name}
              </Link>
            </li> */}
          </ul>
          
        </div>
        <div>
            
            {product.reviews?.length > 0 ? (<div className="flex flex-col gap-4 ">
              <h3 className=" text-heading font-semibold text-lg">{t("text-reviews")}</h3>
              <div className=''>
                <h3>{t("text-customer-reviews")}</h3>
                <div className='flex gap-1'>

                  <Rating  disabled value={product?.ratings} /> 

                   <span>{product.ratings}</span> <span>{t("text-of")}</span> <span>5</span> 

                </div>
                {product.rating_count?.map((item)=><div className='flex gap-2 bg-ye items-center'>
            <Rating  disabled value={item.rating} />
            <LinearProgress variant="determinate" color="warning" className='flex-1' value={Number(item.total*100/product.total_reviews)} /> %{Number(item.total*100/product.total_reviews).toFixed(0)} ({item.total})
          </div>)}
                </div>
                <div>
              {product.reviews.map((review: any) => (
                <div key={review.id} className='flex gap-2 border-b border-gray-300 pb-2 mb-4'>
                  <div >
                    
                  <Avatar
          src={
            review?.avatar?.thumbnail ?? siteSettings?.avatar?.placeholder
          }
          title="user name"
          className="h-[38px] w-[38px] border-border-200"
        />
        <div>

          
          </div>
        

                   
                  </div>
                  <div className='flex flex-col gap-1'>
                  <span className=' font-semibold'>{review?.user.name}</span>
                  
                  <div className='text-xs'>
                    {moment(review.created_at).format("DD MMM YYYY")}
                    </div>

                  <div>
                    <Rating value={review.rating} disabled /> {}</div>
                  <div>{review.comment}</div>

                  </div>
                </div>
             ))}
             </div>
            </div>):(<></>)}
          </div>
      </div>
      
      <Modal open={showSizeGuide} onClose={() => setShowSizeGuide(false)}>
        <div className="w-full flex flex-col gap-4 overflow-hidden text-heading max-w-4xl rounded-xl bg-white p-4">
          <h3 className="text-lg font-semibold  text-slate-800 border-b pb-2 border-gray-300">{t("text-size-guide")}</h3>
          
          <Image
           sizes="100vw"
           style={{
             width: '100vw',
             height: 'auto',
           }}
           width={500}
           height={300}
            src={product.size_guide?.original}
            alt={t("text-size-guide")}
           />

        </div>
      </Modal>
      
    </div>
  );
};

export default ProductSingleDetails;
