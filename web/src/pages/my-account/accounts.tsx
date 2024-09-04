import ManageAccount from "@components/account/manageAccount";
import { getLayout } from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useUI } from "@contexts/ui.context";
import { useAccounts, useAddAccounts } from "@framework/account";
import { Dialog, Drawer, MenuItem, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { AccountType, AccountTypes } from "@type/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import client from '@framework/utils/index'
import { useRouter } from "next/navigation";



export default function AccountsPage(){
    
    const { t } = useTranslation('common');
    const router=useRouter()
    const {cards:accounts}=useAccounts()
    const [account,setAccount]=useState<any>()
   const [open,setOpen]=useState(false)
   const [openDeleteModal,setOpenDeleteModal]=useState(false)

   const onDelete=async(item)=>{
    setAccount(item)
    setOpenDeleteModal(true)
   }

useEffect(()=>{
    setAccount({}) 
    
 } ,[open])


 const onUpdate=async(account:AccountType)=>{
    setAccount(account)
    setOpen(true)
 }


    

    return <AccountLayout>

        <div className="bg-white p-4 rounded-lg">


            <div className="flex justify-between">
                <h1>{t("text-accounts")}</h1>

                <span onClick={()=>setOpen(true)} className="flex gap-1 px-3 py-1 bg-slate-50 rounded-2xl cursor-pointer">
                    <IconPlus />
                    {t("text-add-account")}
                    
                </span>
            </div>
            

            <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("text-account-type")}</TableCell>
                            <TableCell>{t("text-account-name")}</TableCell>
                            <TableCell>{t("text-account-number")}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts?.map((account:AccountType)=><TableRow>
                            <TableCell>{account.type}</TableCell>
                            <TableCell>{account.details.name}</TableCell>
                            <TableCell>{account.details.accountNumber}</TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                <IconEdit onClick={()=>onUpdate(account)} />
                                <IconTrash onClick={()=>onDelete(account)} />
                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>


        </div>

        <ManageAccount open={open} setOpen={setOpen} item={account} />

        <Dialog open={openDeleteModal} onClose={()=>setOpenDeleteModal(false)}>
            
            <div className="w-[350px] p-6 flex flex-col gap-4">
                <h1>{t("text-delete-account")}</h1>
                <p>{t("text-delete-account-confirm")}</p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={()=>setOpenDeleteModal(false)}>{t("text-cancel")}</Button>
                    <Button onClick={async()=>{
                        await client.account.delete(account.id)
                        setOpenDeleteModal(false)
                        router.refresh()
                    }} >{t("text-delete")}</Button>
                </div>
            </div>
        </Dialog>

    </AccountLayout>
}


AccountsPage.authenticate = true;
AccountsPage.getLayout = getLayout;
export const getServerSideProps = async ({ locale }: any) => ({
    props: {
      ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
  });