import cn from 'classnames';
import Image from 'next/image';
import { useCallback, useEffect, useState, type FC } from 'react';
import { useUI } from '@contexts/ui.context';
import usePrice from '@lib/use-price';
import { Product } from '@type/index';
import { siteSettings } from '@settings/site.settings';
import { getVariations } from '@framework/utils/get-variations';
import { useCart } from '@store/quick-cart/cart.context';
import { isEmpty, isEqual, isMatch } from 'lodash';
import { generateCartItem } from '@utils/generate-cart-item';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/button';
import Counter from '@components/common/counter';
import { ProductAttributes } from './product-attributes';
import VariationPrice from './product-variant-price';
import StarIcon from '@components/icons/star-icon';
import Commission from './commission';
import ProgressCard from '@components/common/progress-card';

interface ProductProps {
  product: any;
  className?: string;
  contactClassName?: string;
  imageContentClassName?: string;
  variant?:
    | 'grid'
    | 'gridSmall'
    | 'gridSlim'
    | 'list'
    | 'listSmall'
    | 'gridSlimLarge';
  imgLoading?: 'eager' | 'lazy';
}

const ProductCard: FC<ProductProps> = ({
  product,
  className = '',
  contactClassName = '',
  imageContentClassName = '',
  variant = 'list',
  imgLoading,
}) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const { openModal, setModalView, setModalData,openSidebar } = useUI();
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const variations = getVariations(product?.variations!);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
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

  console.log('selectedVariation',selectedVariation)
}


const openCart = useCallback(() => {
  return openSidebar({
    view: 'DISPLAY_CART',
  });
}, []);
const { t } = useTranslation('common');
function addToCart() {
  if (!isSelected) return;
  // to show btn feedback while product carting
  setAddToCartLoader(true);
  setTimeout(() => {
    setAddToCartLoader(false);
    setViewCartBtn(true);
  }, 600);
  const item = generateCartItem(product!, selectedVariation);
  addItemToCart(item, quantity);

  toast(t('add-to-cart'), {
    //@ts-ignore
    type: 'dark',
    progressClassName: 'fancy-progress-bar',
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}
  const { name, image, min_price, max_price, product_type, description } =
    product ?? {};

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const { price: minPrice } = usePrice({
    amount: min_price!,
  });

  const { price: maxPrice } = usePrice({
    amount: max_price!,
  });

  function handlePopupView() {
    setModalData(product.slug);
    setModalView('PRODUCT_VIEW');
    return openModal();
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

  function navigateToCartPage() {
    //closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }

 

  return (
    <div className="relative">
      <div className='absolute text-sm flex gap-1 text-slate-50  px-3 py-1 rounded-lg bg-slate-800 top-2 right-2 z-50'>
        <StarIcon /> {Number(product.ratings).toFixed(1)}
      </div>
    <div
      className={cn(
        'group box-border overflow-hidden flex rounded-md cursor-pointer',
        {
          'ltr:pr-0 rtl:pl-0 pb-2 lg:pb-3 flex-col items-start bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:md:-translate-y-1.5 hover:shadow-product':
            variant === 'grid' || variant === 'gridSmall',
          'ltr:pr-0 rtl:pl-0 md:pb-1 flex-col items-start bg-white':
            variant === 'gridSlim' || variant === 'gridSlimLarge',
          'items-center bg-transparent border border-gray-100 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-listProduct':
            variant === 'listSmall',
          'flex-row items-center transition-transform ease-linear bg-gray-200 ltr:pr-2 ltr:lg:pr-3 ltr:2xl:pr-4 rtl:pl-2 rtl:lg:pl-3 rtl:2xl:pl-4':
            variant === 'list',
        },
        className
      )}
     
      // role="button"
      title={name}
    >
      <div
       onClick={handlePopupView}
        className={cn(
          'flex relative ltr:rounded-l-md rtl:rounded-r-md ',
          {
            'mb-3 md:mb-3.5 w-full aspect-[17/22]': variant === 'grid',
            'mb-3 md:mb-3.5 w-full aspect-[1/1.3]': variant === 'gridSmall',
            'mb-3 md:mb-3.5 pb-0 aspect-square w-full rounded-md overflow-hidden':
              variant === 'gridSlim',
            'mb-3 md:mb-3.5 pb-0 aspect-[1/1.2] w-full rounded-md overflow-hidden':
              variant === 'gridSlimLarge',
            'flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44 lg:h-44 aspect-square':
              variant === 'listSmall',
            'aspect-square': variant === 'list',
          },
          imageContentClassName
        )}
      >
        <Image
          src={image?.original ?? siteSettings?.product?.placeholderImage()}
          fill
          loading={imgLoading}
          quality={100}
          alt={name || 'Product Image'}
          className={cn('bg-gray-300 object-cover', {
            'rounded-md transition duration-200 ease-in group-hover:rounded-b-none':
              variant === 'grid' || variant === 'gridSmall',
            'transition duration-150 ease-linear transform group-hover:scale-105':
              variant === 'gridSlim' || variant === 'gridSlimLarge',
            'ltr:rounded-l-md rtl:rounded-r-md transition duration-200 ease-linear transform group-hover:scale-105':
              variant === 'list',
          })}
          sizes="(max-width: 768px) 100vw"
        />
      </div>
      <div
        className={cn(
          'w-full overflow-hidden ',
          {
            'ltr:pl-0 rtl:pr-0 ltr:lg:pl-2.5 ltr:xl:pl-4 rtl:lg:pr-2.5 rtl:xl:pr-4 ltr:pr-2.5 ltr:xl:pr-4 rtl:pl-2.5 rtl:xl:pl-4':
              variant === 'grid' || variant === 'gridSmall',
            'ltr:pl-0 rtl:pr-0': variant === 'gridSlim',
            'px-4 lg:px-5 2xl:px-4': variant === 'listSmall',
          },
          contactClassName
        )}
      >
        <h2
          className={cn('text-heading font-semibold truncate mb-1 px-2', {
            'text-sm md:text-base':
              variant === 'grid' || variant === 'gridSmall',
            'md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg':
              variant === 'gridSlim',
            'text-sm sm:text-base md:mb-1.5 pb-0': variant === 'listSmall',
            'text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5':
              variant === 'list',
          })}
        >
          {name}
        </h2>
        {description && (
          <p className="text-body text-xs md:text-[13px] lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate">
            {description}
          </p>
        )}

        <div
          className={`text-heading px-2 font-semibold text-sm sm:text-base mt-1.5 space-x-1 rtl:space-x-reverse ${
            variant === 'grid' || variant === 'gridSmall'
              ? '3xl:text-lg lg:mt-2.5'
              : 'sm:text-lg md:text-base 3xl:text-xl md:mt-2.5 2xl:mt-3'
          }`}
        >
          {!isEmpty(variations)? (
            <>
              <VariationPrice basePriceClassName="text-heading font-semibold text-base md:text-md lg:text-md"
                  selectedVariation={selectedVariation}
                  minPrice={product.min_price}
                  maxPrice={product.max_price}
                />
            </>
          ) : (
            <>
              <span className="inline-block">{price}</span>

              {basePrice && (
                <del className="font-normal text-gray-800 sm:text-base ltr:pl-1 rtl:pr-1">
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
        <div className="mb-2">
            <ProgressCard soldProduct={!isEmpty(variations)?selectedVariation?.sold_quantity:product?.sold_quantity} totalProduct={!isEmpty(variations)?selectedVariation?.quantity:product?.quantity} /> 
            
             </div>
        </div>
      </div>
      <div className='w-full p-3'>
        {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={`popup-attribute-key${variation}`}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
                clearAttribute={handleClearAttribute}
              />
            );
          })}

          <div className="pt-2 w-full">
            <div 
            // className="flex items-center justify-between mb-4 space-x-3 sm:space-x-4 rtl:space-x-reverse"
            >
              {/* {isEmpty(variations) && (
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
                    <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:first:-mr-4">
                      {t('text-out-stock')}
                    </div>
                  )}
                </>
              )} */}

              {/* {!isEmpty(selectedVariation) && (
                <>
                  {selectedVariation?.is_disable ||
                  selectedVariation.quantity === 0 ? (
                    <div className="text-base text-red-500 whitespace-nowrap ltr:lg:ml-7 rtl:first:-mr-4">
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
              )} */}

              <Button
                onClick={addToCart}
                variant="slim"
                
                className={`w-full my-2 ${
                  !isSelected && 'bg-gray-400 hover:bg-gray-400'
                }`}
                disabled={
                  !isSelected ||
                  !product?.quantity ||
                  (!isEmpty(selectedVariation) &&
                    !selectedVariation?.quantity) ||
                  (!isEmpty(selectedVariation) && selectedVariation?.is_disable)
                }
                loading={addToCartLoader}
              >
                {isClient&&<span className="py-2 3xl:px-8">
                  {product?.quantity ||
                  (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                    ? t('text-add-to-cart')
                    : t('text-out-stock')}
                </span>}
              </Button>
            </div>

            {/* {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 text-sm transition-colors bg-gray-100 border border-gray-300 rounded h-11 md:h-12 text-heading focus:outline-none hover:bg-gray-50 focus:bg-gray-50 xl:text-base"
              >
                {t('text-view-cart')}
              </button>
            )} */}

            {/* <Button
              onClick={handlePopupView}
              variant="flat"
              className="w-full h-11 md:h-12"
            >
              {t('text-view-details')}
            </Button> */}
          </div>
          </div>
    </div>
   
    </div>
  );
};

export default ProductCard;
