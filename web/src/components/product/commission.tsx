import { siteSettings } from "@settings/site.settings";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type props={
    selectedVariation:any
    commission:number
}


const Commission=({selectedVariation={commission:0},commission=0}:props)=>{
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
       setLoaded(true) 
    },[])

    const { t } = useTranslation();
    if(!loaded) return <></>
    return <div className="flex ">
    {t("text-commission")}: 
        {selectedVariation?selectedVariation?.commission:commission}  {siteSettings.currency}
    </div>

}


export default Commission