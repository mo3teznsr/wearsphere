import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { Fragment, useEffect, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { OrderStatus, SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useExportOrderQuery } from '@/data/export';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import PageHeading from '@/components/common/page-heading';
import Badge from '@/components/ui/badge/badge';
import Input from '@/components/ui/input';

import AsyncSelect from 'react-select/async';
import { QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { userClient } from '@/data/client/user';
import { selectStyles } from '@/components/ui/select/select.styles';


export default function Orders() {
  const router = useRouter();
  const { locale } = useRouter();
  const {
    query: { shop },
  } = router;
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [filters, setFilters] = useState({
    order_status:"",
    customer_id:"",
    dateFrom: "",
    dateTo: "",
    customer_name: "",
    payment_status: "",
    payment_method: "",
    state:"",
    area:"",
    customer_contact:""
  })


  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    {
      slug: shop as string,
    },
    {
      enabled: !!shop,
    }
  );

  const paymentSatuses=['payment-processing','payment-success','payment-failed','payment-reversal','payment-refunded','payment-cash-on-delivery','payment-cash','payment-wallet','payment-awaiting-for-approval','payment-pending']
  const [search, setSearch] = useState({searchTerm:"",customer_name:"",contact_number:""});
  const handleChangeFilter=(e:any)=>{
    setSearch({...search,[e.target.name]:e.target.value})
  }
  const shopId = shopData?.id!;
  const { orders, loading, paginatorInfo, error } = useOrdersQuery({
    language: locale,
    limit: 20,
    page,
    orderBy,
    sortedBy,
    search ,
    ...filters
  });
  const { refetch } = useExportOrderQuery(
    {
      ...(shopId && { shop_id: shopId }),
    },
    { enabled: false }
  );

  if (loading) return <Loader text={t('common:text-loading')} />;

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleExportOrder() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data.replaceAll(".com",'.com/api');
      a.setAttribute('download', 'export-order');
      a.click();
    }
  }

const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setFilters((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};

function onCustomerUpdate(customer: any) {
  setFilters((prevState) => ({
    ...prevState,
    customer_id: customer.value,
  }))
  
}

async function fetchAsyncOptions(inputValue: string) {
  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery(
    [API_ENDPOINTS.USERS, { text: inputValue, page: 1 }],
    () => userClient.fetchUsers({ name: inputValue, page: 1 })
  );

  const results = data?.data?.map((user: any) => ({
    value: user.id,
    label: user.name,
  }));

  return [{label:t("text-all"),value:""},...results]
}

  return (
    <>
      <Card >
        <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full flex-row items-center md:w-1/2">
        
          <Search
            onSearch={handleSearch}
            className="w-full"
            placeholderText={t('form:input-placeholder-search-tracking-number')}
          />
          <Menu
            as="div"
            className="relative inline-block ltr:text-left rtl:text-right"
          >
            <Menu.Button className="group p-2">
              <MoreIcon className="w-3.5 text-body" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                className={classNames(
                  'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left'
                )}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleExportOrder}
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body'
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {t('common:text-export-orders')}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        </div>
        <div>
        <div className='flex gap-1'>
         
         <span 
         onClick={() => setFilters({ ...filters, order_status: "" })}
         className={`px-4 py-1 rounded-xl cursor-pointer ${!filters.order_status==""?"bg-gray-100 text-gray-600":"bg-accent text-light"}`} >{t("text-all")}</span>
         {Object.values(OrderStatus).map((key) => (
           <span
             className={`px-4 py-1 cursor-pointer rounded-xl ${filters.order_status==key?"bg-accent text-light":"bg-gray-100 text-gray-600"}`}
             key={key}
             onClick={() => setFilters({ ...filters, order_status: key })}
           >
             {t(`common:${key}`)}
           </span>
         ))}
            
         
        </div>
        <div className='flex gap-2 mt-4'>

          <Input placeholder={t('form:input-label-date-from')}  name='datefrom' label={t('form:input-label-date-from')} value={filters.dateFrom} type="date" onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
          <Input name='dateTo' label={t('form:input-label-date-to')} value={filters.dateTo} type="date" onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
          <Input name="customer_contact" className='w-full' label={t("form:input-label-contact")}  onChange={handleChangeFilter} placeholder={t("form:input-label-contact")}/>
          <Input name="customer_name" className='w-full' label={t("text-customer")} onChange={handleChangeFilter} placeholder={t("text-customer")} />
         <div className='flex flex-col gap-1 w-full'>
          <div className='mt-[-5px] mb-[0px]' >{t("text-affiliate")}</div>
          <AsyncSelect 
        styles={selectStyles}
        placeholder={t("text-affiliate")}
          cacheOptions
          loadOptions={fetchAsyncOptions}
          defaultOptions
          onChange={onCustomerUpdate}
        />

       
        </div>
        <div>
          <label>{t("text-payment-status")}</label>
        <select name="payment_status" value={filters.payment_status} onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}>
          <option value="">{t("text-all")}</option>
          {paymentSatuses.map((item) => (
            <option value={item}>{item}</option>
          ))}
        </select>
        </div>
        </div>
        </div>
      </Card>

      <OrderList
        orders={orders}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Orders.authenticate = {
  permissions: adminOnly,
};
Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
