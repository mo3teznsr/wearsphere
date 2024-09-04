
import { useTranslation } from 'next-i18next';

import { useRouter } from 'next/router';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState } from 'react';


import Image from 'next/image';

import Badge from '@components/ui/badge';
import { MappedPaginatorInfo, SortOrder } from '@type/index';
import usePrice from '@lib/use-price';
import Table from 'rc-table';
import Pagination from '@components/ui/pagination';
import { siteSettings } from '@settings/site.settings';

type IProps = {
  withdraws: any[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const WithdrawList = ({
  withdraws,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();

  const router = useRouter();

  const renderStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return (
          <Badge
            text={t('text-approved')}
            color="bg-accent bg-opacity-10 !text-accent"
          />
        );
      case 'PENDING':
        return (
          <Badge
            text={t('text-pending')}
            color="bg-purple-500 bg-opacity-10 text-purple-500"
          />
        );
      case 'ON_HOLD':
        return (
          <Badge
            text={t('text-on-hold')}
            color="bg-pink-500 bg-opacity-10 text-pink-500"
          />
        );
      case 'REJECTED':
        return (
          <Badge
            text={t('text-rejected')}
            color="bg-red-500 bg-opacity-10 text-red-500"
          />
        );
      case 'PROCESSING':
        return (
          <Badge
            text={t('text-processing')}
            color="bg-yellow-500 bg-opacity-10 text-yellow-600"
          />
        );
    }
  };

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  let columns = [
   

    {
      title:t('text-amount'),
      className: 'cursor-pointer',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      
      onHeaderCell: () => onHeaderClick('amount'),
      render: function Render(amount: number) {
        const { price } = usePrice({
          amount: amount as number,
        });
        return <div>{price}</div>;
      },
    },
    {
      title: t('text-created-at'),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
     width:"450px",
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('text-payment-method'),
      dataIndex: 'payment_method',
      key: 'payment_method',

   
    },
    {
      title: t('text-status'),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
   
      onHeaderCell: () => onHeaderClick('status'),
      render: (status: string) => renderStatusBadge(status),
    },

    // {
    //   title: t('table-item-actions'),
    //   dataIndex: 'id',
    //   key: 'actions',

    //   width: 120,
    //   render: (id: string) => {
       
        
    //       return (
    //         <ActionButtons
    //           detailsUrl={`${Routes.withdraw.list}/${id}`}
    //           id={id}
    //         />
    //       );
        
    //     return null;
    //   },
    // },
  ];
  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'actions');
  }
  return (
    <>
      <div className="mb-6 w-full overflow-hidden rounded shadow">

      <table className='table-auto my-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">{t("text-amount")}</th>
            <th scope="col" className="px-6 py-3">{t("text-date")}</th>
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">{t("text-payment-method")}</th>
            <th scope="col" className="px-6 py-3">{t("text-status")}</th>
            

          </thead>
          <tbody>
            {withdraws?.map((product:any) => (
              <tr className="border-b border-gray-200 dark:border-gray-700" key={product.id}>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">{siteSettings.currency} {product.amount}</td>
                <td className="px-6 py-4 text-slate-900"> {dayjs.utc(product.created_at).tz(dayjs.tz.guess()).fromNow()}</td>
                <td scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">{product.payment_method}</td>

                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-white dark:text-white dark:bg-gray-800">{renderStatusBadge(product.status)}</td>
                </tr>
            ))}
          </tbody>
        </table>
        {/* <Table
        
        className='w-full'
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
             
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('empty-table-data')}
              </div>
              <p className="text-[13px]">{t('empty-table-sorry-text')}</p>
            </div>
          )}
          data={withdraws}
          rowKey="id"
         
        /> */}
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default WithdrawList;
