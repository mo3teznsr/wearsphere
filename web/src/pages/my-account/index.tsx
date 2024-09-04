import Link from "@components/ui/link";
import { getLayout } from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import { ROUTES } from "@lib/routes";
import { useTranslation } from "next-i18next";
import {useUser} from "@framework/auth";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { useOrderStatuses } from "@framework/orders";
import { siteSettings } from "@settings/site.settings";
import { useSearchParams } from 'next/navigation';
import moment from "moment";
import { usePaymentStatuses } from "@framework/payments";
import PaymentStatus from "@components/account/paymentStatus";
import OrderStatuses from "@components/account/OrderStatuses";

export { getStaticProps } from "@framework/common.ssr";

export default function AccountPage() {
  const searchParams = useSearchParams();
  const start=searchParams.get("start")??moment().subtract(1,'months').format('YYYY-MM-DD')
  const end=searchParams.get("end")??moment().add(1,'days').format('YYYY-MM-DD')
  const { t } = useTranslation("common");
  const { me, loading } = useUser();


  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner showText={false} />
      </div>
    );
  }

  const total_commission=0

  const currentUserIdentity = me?.name ?? me?.email;
  return (
    <AccountLayout>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-3 xl:mb-5">
        {t("text-dashboard")}
      </h2>
   
      {/* <div className="text-sm leading-7 md:text-base md:leading-loose">
        <p className="capitalize">
          {t("text-hello")}{" "}
          <span className="font-bold">{currentUserIdentity}</span> (not{" "}
          <span className="font-bold">{currentUserIdentity}</span>?{" "}
          <Link
            href={`${ROUTES.LOGOUT}`}
            className="font-bold underline cursor-pointer focus:outline-none"
          >
            {t("text-logout")}
          </Link>
          )
        </p>
        <br />
        {t("text-account-dashboard")}{" "}
        <Link
          href={ROUTES.ACCOUNT_ORDERS}
          className="text-heading underline font-semibold"
        >
          {t("text-recent-orders")}
        </Link>
        , {t("text-manage-your")}{" "}
        <Link
          href={ROUTES.ACCOUNT_ADDRESS}
          className="text-heading underline font-semibold"
        >
          {t("text-account-address")}
        </Link>{" "}
        {t("text-and")}{" "}
        <Link
          href={ROUTES.ACCOUNT_CONTACT_NUMBER}
          className="text-heading underline font-semibold"
        >
          {t("text-contact-number")}
        </Link>{" "}
        {t("text-and")}{" "}
        <Link
          href={ROUTES.ACCOUNT_CHANGE_PASSWORD}
          className="text-heading underline font-semibold"
        >
          {t("text-change-your-password")}
        </Link>
      </div> */}

      <form>
        <div className="flex items-end  gap-x-2">
          <div>
            <label
              htmlFor="start"
              className="block text-sm font-medium text-gray-700"
            >
              {t("text-start-date")}
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="start"
                id="start"
                className="block w-full px-2 py-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                defaultValue={start}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="end"
              className="block text-sm font-medium text-gray-700"
            >
              {t("text-end-date")}
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="end"
                id="end"
                className="block w-full px-2 py-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                defaultValue={end}
              />
            </div>
          </div>
          <div>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 mb-1 rounded-md  ">{t("text-submit")}</button>
          </div>
        </div>
      </form>
      <div className="grid gap-3 mt-4 grid-cols-3">
       <OrderStatuses />
      </div>

      <div className="grid gap-3 mt-4 grid-cols-3">

        <div className="flex flex-col bg-slate-600 py-3 text-white rounded-lg gap-3 w-full col-span-1 items-center justify-center ">
          <p className="mb-0">{t("total-commission")}</p>
          <p>{siteSettings.currency } {total_commission}</p>
        </div>
        <PaymentStatus />
      </div>
    </AccountLayout>
  );
}

AccountPage.authenticate = true;
AccountPage.getLayout = getLayout;
