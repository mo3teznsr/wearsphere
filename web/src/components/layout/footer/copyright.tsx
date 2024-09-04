import { IyzicoIcon } from '@components/icons/payment-gateways/iyzico';
import { MollieIcon } from '@components/icons/payment-gateways/mollie';
import { PayPalIcon } from '@components/icons/payment-gateways/paypal';
import { PayStack } from '@components/icons/payment-gateways/paystack';
import { RazorPayIcon } from '@components/icons/payment-gateways/razorpay';
import { StripeIcon } from '@components/icons/payment-gateways/stripe';
import Container from '@components/ui/container';
import Link from '@components/ui/link';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useSettings } from '@framework/settings';
import { ROUTES } from '@lib/routes';
import { isEmpty } from 'lodash';

const Copyright = () => {
  const { data, isLoading } = useSettings();
  const showPaymentGateways =
    !isEmpty(data?.options?.paymentGateway) && data?.options?.useEnableGateway!;
  const date = new Date();
  const icon: any = {
    stripe: <StripeIcon className="h-4 w-auto" />,
    paypal: <PayPalIcon className="h-4 w-auto" />,
    razorpay: <RazorPayIcon className="h-4 w-auto" />,
    mollie: <MollieIcon className="h-4 w-auto" />,
    paystack: <PayStack className="h-4 w-auto" />,
    iyzico: <IyzicoIcon className="h-4 w-auto" />,
  };
  return (
    <div className="border-t border-gray-300 pt-5 pb-16 sm:pb-20 md:pb-5 mb-2 sm:mb-0">
      <Container className="flex flex-col-reverse md:flex-row text-center md:justify-between">
        {isLoading ? (
          <Spinner simple />
        ) : (
          <p className="text-body text-xs md:text-[13px] lg:text-sm leading-6">
            ©{date.getFullYear()}{' '}
            <Link
              className="font-semibold text-gray-700 transition-colors duration-200 ease-in-out hover:text-body"
              href={data?.options?.siteLink ?? ROUTES?.HOME}
            >
              {data?.options?.siteTitle}
            </Link>
            . {data?.options?.copyrightText}{' '}
            {data?.options?.externalText ? (
              <Link
                className="font-semibold text-gray-700 transition-colors duration-200 ease-in-out hover:text-body"
                href={data?.options?.externalLink ?? ROUTES?.HOME}
              >
                {data?.options?.externalText}
              </Link>
            ) : (
              ''
            )}
          </p>
        )}

        {isLoading ? (
          <Spinner simple />
        ) : (
          showPaymentGateways && (
            <ul className="hidden md:flex flex-wrap justify-center items-center space-x-4 xs:space-x-5 lg:space-x-7 rtl:space-x-reverse mb-1 md:mb-0 mx-auto md:mx-0">
              {data?.options?.paymentGateway?.map(
                (item: { name: string }, index: number) =>
                  icon[item?.name] ? (
                    <li
                      className="mb-2 md:mb-0 transition hover:opacity-80"
                      key={index}
                    >
                      {icon[item?.name]}
                    </li>
                  ) : (
                    ''
                  )
              )}
            </ul>
          )
        )}
      </Container>
    </div>
  );
};

export default Copyright;
