import React, { useState } from 'react';
import { guestEmailAtom, guestNameAtom } from '@store/checkout';
import { useAtom, WritableAtom } from 'jotai';
import Input from '@components/ui/input';
import { Tooltip } from 'react-tooltip';
import { InfoIcon } from '@components/icons/info-icon';
import PhoneInput from '@components/ui/forms/phone-input';
import { MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Address } from '@type/index';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@components/ui/forms/form';
import * as yup from "yup";
interface GuestNameProps {
  count: number;
  label: string;
  className: string;
  atom?:WritableAtom<Address | null, any, Address>;
  orderData:any;
  handelChange:(e: any) => void
  handelChangeAddress:(e: any) => void
}

function GuestName({ count, label, className,atom,orderData,handelChange,handelChangeAddress }: GuestNameProps) {
  const [name, setName] = useAtom(guestNameAtom);
  const [address, setAddress] = useState({});
  const [emailAddress, setEmailAddress] = useAtom(guestEmailAtom);
  const [mobile, setMobile] = React.useState('');
  const { t } = useTranslation('common');

  const addressSchema = yup.object().shape({
    customer_name: yup.string().required("error-name-required"),
    customer_contact: yup.string().required("error-contact-required"),
    address: yup.object().shape({
      country: yup.string().required("error-country-required"),
      city: yup.string().required("error-city-required"),
      state: yup.string().required("error-state-required"),
      zip: yup.string().required("error-zip-required"),
      street_address: yup.string().required("error-street-required"),
    }),
  });

  const defaultValues = orderData;
  return (
    <Form
       onSubmit={()=>{}}
        className="w-full"
        //@ts-ignore
        validationSchema={addressSchema}
        useFormProps={{
          shouldUnregister: true,
          defaultValues,
        }}
        resolver={defaultValues}
      >
        {({ register, formState: { errors } }) => {
          return (
            <>
             
    <div className={className}>
      <div className="flex items-center justify-between mb-5 lg:mb-6 xl:mb-7 -mt-1 xl:-mt-2">
        <div className="flex items-center gap-3 md:gap-4 text-lg lg:text-xl text-heading capitalize font-medium">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-heading text-base text-white lg:text-xl">
              {count}
            </span>
          )}
          {label}
          <a data-tooltip-id="my-tooltip" data-tooltip-content="Email address is mandatory for some payment gateways">
            <InfoIcon className='w-4 h-4' />
          </a>
          <Tooltip id="my-tooltip" style={{ background: "#212121", fontSize: "14px", padding: "0 10px"}} />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
      <div dir='ltr' className="flex flex-col gap-4">
      <PhoneInput
                  country="om"
                  inputClass={
                      ' !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-gray-300 !rounded focus:!border-accent !h-[52px]'
                      
                    
                  }
                 
                 value={orderData.customer_contact}
                  onChange={value=>handelChange({target:{name:'customer_contact',value}})}
                />
              </div>
            
        <Input
          labelKey='text-name'
          //@ts-ignore
         name="customer_name"
         value={orderData.customer_name}
         onChange={handelChange}
          variant="outline"
          placeholder={t("text-name")}
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        <Input
          labelKey='text-email'
          //@ts-ignore
         name="customer_email"
         value={orderData.customer_email}
         onChange={handelChange}
          variant="outline"
          placeholder={t("text-email")}
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        <Input
        labelKey='text-country'
          //@ts-ignore
         name="country"
         value={orderData.address.country}
         onChange={handelChangeAddress}
          variant="outline"
          placeholder={t("text-country")}
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        <Input
        labelKey='text-city'
          //@ts-ignore
         name="city"
         value={orderData.address.city}
         onChange={handelChangeAddress}
          variant="outline"
          placeholder={t("text-area")}
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        <Input
        labelKey='text-street-address'
          //@ts-ignore
         name="street_address"
         value={orderData.address.street_address}
         onChange={handelChangeAddress}
          variant="outline"
          placeholder={t("text-area")}
          inputClassName='py-2 px-4 md:px-5 w-full appearance-none border text-input text-xs md:text-[13px] lg:text-sm font-body rounded-md placeholder-body min-h-12 transition duration-200 ease-in-out bg-white border-gray-300 focus:outline-none focus:border-heading h-11 md:h-12'
        />
        
         

        </div>
      
    </div>
    </>
          );}}
          </Form>
  );
}
export default GuestName;
