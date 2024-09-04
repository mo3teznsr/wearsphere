
import OrderStatuses from '@components/account/OrderStatuses';
import PaymentStatus from '@components/account/paymentStatus';
import { getLayout } from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import WithdrawList from '@components/withdraw/withdraw-list';
import { useUser } from '@framework/auth';
import { useOrderStatuses } from '@framework/orders';
import { useWithdrawsQuery } from '@framework/withdraw';
import { siteSettings } from '@settings/site.settings';
import { SortOrder } from '@type/index';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { useRouter } from 'next/router';


import { useState } from 'react';


export default function WithdrawsPage() {
  const router = useRouter();
  const { me } = useUser();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const {data:orderStatus}=useOrderStatuses()
  const { withdraws, paginatorInfo, loading, error } = useWithdrawsQuery(
    {
     
      limit: 10,
      page,
      orderBy,
      sortedBy,
     
    },
    {
      enabled: true,
    }
  );


  function handlePagination(current: any) {
    setPage(current);
  }



  return (
    <AccountLayout>
    <div className='bg-white rounded-lg p-4'>
      <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
         <h2 className='text-heading text-lg '>{t('common:text-withdraws')}</h2>
        </div>

        <Link
          href={`/my-account/withdraws/create`}
          className="px-4 py-2 rounded-md w-full bg-slate-700 text-white self-baseline md:w-auto md:ms-auto"
        >
          <span>+ {t('text-add-withdraw')}</span>
        </Link>
      </div>

      {/* <div className="grid gap-2 my-4 grid-cols-5">
      <div
        className="col-span-1 flex flex-col bg-slate-100 rounded-xl items-center justify-center"

        >
          {t('text-total-balance')}
          <div>{me?.wallet.total_points}</div>
        </div>
        <div
        className="col-span-1 flex flex-col bg-slate-100 rounded-xl items-center justify-center"

        >
          {t('text-available-balance')}
          <div>{me?.wallet.available_points}</div>
        </div>
        <div
        className="col-span-1 flex flex-col bg-slate-100 rounded-xl items-center justify-center"

        >
          {t('text-used-balance')}
          <div>{me?.wallet.points_used}</div>
        </div>
        {orderStatus?.map((status) => (
          <div
            key={status.id}
            className="col-span-1 flex flex-col bg-slate-100 rounded-xl items-center justify-center"
          >
            {t(status.status)}
            <div>{siteSettings.currency } {Number(status.total_commission).toFixed(2)}
              </div>
            </div>  ))}
      </div> */}

<div className="grid gap-3 mt-4 grid-cols-5  mb-4">
       <PaymentStatus />
      </div>

      <WithdrawList
        withdraws={withdraws}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </div>
    </AccountLayout>
  );
}

WithdrawsPage.getLayout = getLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
