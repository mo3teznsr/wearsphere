import Image from 'next/image';
import { useUI } from '@contexts/ui.context';
import usePrice from '@lib/use-price';
import { Product } from '@type/index';
import { useSettings } from '@contexts/settings.context';
import cn from 'classnames';
import { useCallback, useState } from 'react';
import { getVariations } from '@framework/utils/get-variations';
import { isEmpty, isEqual, isMatch } from 'lodash';
import { useCart } from '@store/quick-cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/button';
import { ProductAttributes } from './product-attributes';
import Counter from '@components/common/counter';

interface ProductProps {
  product: any;
  index: number;
  imgLoading?: 'eager' | 'lazy';
  variant?: 'left' | 'center' | 'combined' | 'flat' | 'fashion';
}

const ProductOverlayCard: React.FC<ProductProps> = ({
  product,
  index,
  variant = 'left',
  imgLoading = 'lazy',
}) => {
  let classes;
  let indexes = [2, 3];
  if (variant === 'left' && index === 0) {
    classes = 'row-span-full lg:row-span-2 col-span-full lg:col-span-2';
  } else if (variant === 'center' && index === 1) {
    classes = 'row-span-full lg:row-span-2 col-span-full lg:col-span-2';
  } else if (variant === 'combined') {
    if (index === 0) {
      classes = 'col-span-2 lg:row-span-2 col-span-full lg:col-span-2';
    } else if (index === 2) {
      classes = `col-span-2 lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3`;
    } else {
      classes = 'col-span-2 lg:col-span-1';
    }
  } else if (variant === 'fashion') {
    if (indexes.includes(index)) {
      classes = 'lg:grid lg:grid-cols-4 sm:col-span-2';
    } else {
      classes = `sm:col-span-2 lg:col-span-1`;
    }
  } else {
    classes = 'col-span-2 lg:col-span-1';
  }
  const { t } = useTranslation('common');
  const { closeModal, openSidebar } = useUI();
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
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
const openCart = useCallback(() => {
  return openSidebar({
    view: 'DISPLAY_CART',
  });
}, []);

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
  const { openModal, setModalView, setModalData } = useUI();
  const settings = useSettings();

  const { price, basePrice, discount } = usePrice({
    amount: product.sale_price ? product.sale_price : product.price!,
    baseAmount: product.sale_price,
  });

  const { price: minPrice } = usePrice({
    amount: product.min_price as number,
  });

  const { price: maxPrice } = usePrice({
    amount: product.max_price as number,
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
    closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }

  return (<div>
    <div
     
      className={`${classes} cursor-pointer group flex flex-col bg-gray-200 rounded-md relative items-center justify-between overflow-hidden`}
    >
      <div  onClick={handlePopupView}
        className={`flex justify-center items-center p-4 h-full w-full 3xl:min-h-[330px] ${
          indexes.includes(index) && variant === 'fashion'
            ? 'lg:col-span-2'
            : ''
        }`}
        title={product?.name}
      >
        <div
          className={cn('relative w-[260px] aspect-square ', {
            'w-[620px] ':
              (variant === 'left' && index === 0) ||
              (variant === 'center' && index === 1) ||
              (variant === 'combined' && index === 0),
            'w-[390px] ': variant === 'combined' && index === 2,
          })}
        >
          <Image
            src={
              product?.image?.original ??
              settings.product.placeholderImage('featured')
            }
            fill
            loading={imgLoading}
            alt={product?.name || 'Product Image'}
            className="object-cover transition duration-500 ease-in-out transform group-hover:scale-110"
            sizes="(max-width: 768px) 100vw"
          />
        </div>
      </div>
      {discount && (
        <span className="absolute top-3.5 md:top-5 3xl:top-7 ltr:left-3.5 rtl:right-3.5 ltr:md:left-5 ltr:3xl:left-7 rtl:md:right-5 rtl:3xl:right-7 bg-heading text-white text-10px md:text-sm leading-5 rounded-md inline-block px-2 xl:px-3 pt-0.5 pb-1">
          {discount}
        </span>
      )}

      <div
        className={`flex flex-col w-full px-4 md:px-5 3xl:px-7 pb-4 md:pb-5 3xl:pb-7 md:justify-between md:items-center md:flex-row ${
          indexes.includes(index) && variant === 'fashion'
            ? 'lg:col-span-2 lg:flex-col lg:justify-start lg:items-start'
            : '2xl:flex-row lg:items-start 2xl:items-center lg:flex-col'
        }`}
        title={product?.name}
      >
        <div
          className={`${
            indexes.includes(index) && variant === 'fashion'
              ? 'lg:pb-4 2xl:pb-8 ltr:md:pr-2 rtl:md:pl-2'
              : 'ltr:md:pr-2 ltr:lg:pr-0 ltr:2xl:pr-2 rtl:md:pl-2 rtl:lg:pl-0 rtl:2xl:pl-2'
          } overflow-hidden max-w-full`}
        >
          <h2 className="mb-1 text-sm font-semibold truncate text-heading md:text-base xl:text-lg">
            {product?.name}
          </h2>
          <p className="text-body text-xs md:text-[13px] xl:text-sm leading-normal xl:leading-relaxed truncate max-w-[250px] lg:max-w-[190px]">
            {product?.description}
          </p>
        </div>
        <div
          className={`flex-shrink-0 flex flex-row-reverse md:flex-col lg:flex-row-reverse 2xl:flex-col justify-end mt-2 md:-mt-0.5 lg:mt-2 2xl:-mt-0.5 ${
            indexes.includes(index) && variant === 'fashion'
              ? ''
              : 'items-center md:items-end lg:items-start 2xl:items-end ltr:md:text-right rtl:md:text-left ltr:lg:text-left rtl:lg:text-right ltr:xl:text-right rtl:xl:text-left'
          }`}
        >
          {product.product_type === 'variable' ? (
            <div className="text-heading font-segoe font-semibold text-base xl:text-xl 3xl:mt-0.5 ltr:pr-2 ltr:md:pr-0 ltr:lg:pr-2 ltr:2xl:pr-0 rtl:pl-2 rtl:md:pl-0 rtl:lg:pl-2 rtl:2xl:pl-0">
              {minPrice} - {maxPrice}
            </div>
          ) : (
            <>
              {discount && (
                <del className="text-sm md:text-base lg:text-sm xl:text-base 3xl:text-lg">
                  {price}
                </del>
              )}
              <div className="text-heading font-segoe font-semibold text-base xl:text-xl 3xl:mt-0.5 ltr:pr-2 ltr:md:pr-0 ltr:lg:pr-2 ltr:2xl:pr-0 rtl:pl-2 rtl:md:pl-0 rtl:lg:pl-2 rtl:2xl:pl-0">
                {basePrice ? basePrice : price}
              </div>
            </>
          )}
        </div>
        
      </div>
   
    </div>
    
    </div>
  );
};

export default ProductOverlayCard;
