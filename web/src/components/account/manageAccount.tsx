import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useAddAccounts } from "@framework/account";
import { Drawer, MenuItem, TextField } from "@mui/material";
import { AccountType, AccountTypes } from "@type/index";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import client from '@framework/utils/index'
import { useRouter } from "next/navigation";



const ManageAccount = ({open=false,setOpen=(a)=>{},item={}}) => {
    const router=useRouter()
    const [entity,setEntity]=useState<any>({
        type:"",
        details:{
            accountNumber:"",
            name:"",
        }
    })

    useEffect(()=>{
        console.log(item)
        setEntity(item)
    },[open])

   const handelChange=(e:any)=>{
    const {name,value}=e.target
    setEntity({...entity,[name]:value})
   }

   const handelChangeDetails=(e:any)=>{
    const {name,value}=e.target
    setEntity({...entity,details:{...entity.details,[name]:value}})
   }


   const handelSubmit=async()=>{
    if(!entity.id)
   { await client.account.create({...entity})}
    else{
        await client.account.update({...entity})
    }
   setOpen(false)
   router.refresh()

   }

    const {t}=useTranslation('common')
    return <Drawer open={open} onClose={() => setOpen(false)}>
    <div className="w-[350px] px-2 flex flex-col gap-3">

        <h1>{entity.id?t("text-edit-account"):t("text-add-account")}</h1>
       
       

        <div>
            <span className="mb-2">{t("text-account-type")}</span>
            
        
        <select onChange={handelChange} className="px-1 py-2 w-full border border-slate-300 mt-1 rounded-md" value={entity.type} name="type">
            <option value=""></option>
            <option value={AccountTypes.Bank}>{t(AccountTypes.Bank)}</option>
            <option value={AccountTypes.Wallet}>{t(AccountTypes.Wallet)}</option>
        </select>
        </div>
        <Input name="name" value={entity.details?.name} variant="outline" onChange={handelChangeDetails} labelKey={t("text-account-name")}  />
        <Input name="accountNumber" value={entity.details?.accountNumber} variant="outline" onChange={handelChangeDetails} labelKey={t("text-account-number")}  />
        <Button
        disabled={!entity.type || !entity.details?.name || !entity.details?.accountNumber}
        onClick={handelSubmit}
         >{t("text-save")}
            </Button>
    </div>
</Drawer>
};


export default ManageAccount