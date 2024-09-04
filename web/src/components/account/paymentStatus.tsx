"use client";

import { usePaymentStatuses } from "@framework/payments";
import { siteSettings } from "@settings/site.settings";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";



const PaymentStatus = () => {
   const [data,setData]=useState([]

   )
    const {t}=useTranslation('common')
    

    useEffect(()=>{
        usePaymentStatuses().then(res=>setData(res))
    },[])

    return <>
   {data?.map(({status,amount}) => (
          <div key={status} className="flex flex-col bg-slate-600 py-3 text-white rounded-lg gap-3 w-full col-span-1 items-center justify-center ">
          <p className="mb-0">{t(status)}</p>
          <p>{siteSettings.currency } {amount}</p>
        </div>
        ))}
    </>
}


export default PaymentStatus