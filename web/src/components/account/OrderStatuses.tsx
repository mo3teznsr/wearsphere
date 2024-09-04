import { useOrderStatuses } from "@framework/orders"
import { siteSettings } from "@settings/site.settings"
import { useTranslation } from "react-i18next"





const OrderStatuses = () => {
    const {data,isLoading}=useOrderStatuses()
    const {t}=useTranslation('common')
    if(isLoading)
        return <></> 

    return <>
    {data?.map((status:any) => (
          <div
            key={status.id}
            className="col-span-1  flex py-4 gap-3 flex-col bg-white rounded-xl items-center justify-center"
          >
            {t(status.status)}
            <div>{siteSettings.currency } {Number(status.total_commission).toFixed(2)}
              </div>
            </div>  ))}
    </>
}

export default OrderStatuses