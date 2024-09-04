import { getLayout } from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrdersTable from "@components/my-account/orders-table";
import ErrorMessage from "@components/ui/error-message";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { useOrders } from "@framework/orders";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import NotFound from "@components/404/not-found";
import Input from "@components/ui/input";
import { OrderStatus } from "@type/index";

export { getStaticProps } from "@framework/common.ssr";

export default function OrdersTablePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const paymentSatuses=['payment-processing','payment-success','payment-failed','payment-reversal','payment-refunded','payment-cash-on-delivery','payment-cash','payment-wallet','payment-awaiting-for-approval','payment-pending']
  const [search, setSearch] = useState({searchTerm:"",customer_name:"",contact_number:""});
  const handleChangeFilter=(e:any)=>{
    setSearch({...search,[e.target.name]:e.target.value})
  }
  const [filters, setFilters] = useState({
    order_status:"",
    customer_id:"",
    dateFrom: "",
    dateTo: "",
    customer_name:"",
    customer_contact:""
  })
  const {
    orders,
    isLoading: loading,
    error,
  } = useOrders({
    page,
    limit: 10,
  search,
    ...filters
  });


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

  if (error) return <ErrorMessage message={error.message} />;

  function onPagination(current: any) {
    setPage(current);
  }
  return (
    <AccountLayout>
      {loading ? (
        <div className="flex h-full items-center justify-center w-full h-[300px]">
          <Spinner className="!h-full" showText={false} />
        </div>
      ) : (
        <>
        <div>
          {/* @ts-ignore */}
          <div className="bg-white p-4 rounded-xl">
          <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {t("text-orders")}
      </h2>
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
        {/* <div className='flex gap-2 mt-4'>

          <Input placeholder={t('form:input-label-date-from')} name='datefrom' labelKey={t('form:input-label-date-from')} value={filters.dateFrom} type="date" onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
          <Input name='dateTo' labelKey={t('form:input-label-date-to')} value={filters.dateTo} type="date" onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
          <Input name='name' labelKey={t('text-name')} value={filters.customer_name}  onChange={(e) => setFilters({ ...filters, customer_name: e.target.value })} />
          <Input name='name' labelKey={t('text-contact')} value={filters.customer_contact}  onChange={(e) => setFilters({ ...filters, customer_contact: e.target.value })} />
          
        </div> */}

        </div>

<div className='flex gap-2 mt-4'>

<Input placeholder={t('form:input-label-date-from')}  name='datefrom' labelKey={t('form:input-label-date-from')} value={filters.dateFrom} type="date" onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
<Input name='dateTo' labelKey={t('form:input-label-date-to')} value={filters.dateTo} type="date" onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
<Input name="customer_contact" className='w-full' labelKey={t("form:input-label-contact")}  onChange={handleChangeFilter} placeholder={t("form:input-label-contact")}/>
<Input name="customer_name" className='w-full' labelKey={t("text-customer")} onChange={handleChangeFilter} placeholder={t("text-customer")} />
<div className='flex flex-col gap-1 w-full'>

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
      </div>
          
            <OrdersTable orders={orders} onPagination={onPagination} />
         </div>
        </>
      )}
    </AccountLayout>
  );
}

OrdersTablePage.authenticate = true;
OrdersTablePage.getLayout = getLayout;
