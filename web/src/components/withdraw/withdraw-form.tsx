
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { withdrawValidationSchema } from './withdraw-validation-schema';
import { useState } from 'react';

import { animateScroll } from 'react-scroll';
import { AccountTypes, Withdraw } from '@type/index';
import usePrice from '@lib/use-price';
import { useCreateWithdrawMutation } from '@framework/withdraw';
import Alert from '@components/ui/alert';

import Card from '@components/common/card';
import Label from '@components/ui/label';
import Input from '@components/ui/input';
import TextArea from '@components/ui/text-area';
import Button from '@components/ui/button';
import { MenuItem, TextField } from '@mui/material';
import { useUser } from '@framework/auth';
import { useAccounts } from '@framework/account';
import { values } from 'lodash';



type FormValues = {
  amount: number;
  payment_method: string;
  details: string;
  note: string;
};

type IProps = {
  initialValues?: Withdraw | null;
};
export default function CreateOrUpdateWithdrawForm({ initialValues }: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const {me}=useUser()
  const {cards:accounts}=useAccounts()

const {price:shopBalance}=usePrice({amount:me?.wallet?.available_points||0})
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues,
    //@ts-ignore
    resolver: yupResolver(withdrawValidationSchema),
  });

  const { mutate: createWithdraw, isLoading: creating } =
    useCreateWithdrawMutation();

  const onSubmit = (values: FormValues) => {
    const input = {
      amount: +values.amount,
      
      details: values.details,
      payment_method: values.payment_method,
      note: values.note,
    };

    createWithdraw(
      { ...input },
      {
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message);
          animateScroll.scrollToTop();
        },
      },
    );
  };

  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t('forms:error-insufficient-balance')}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap my-5 sm:my-8">
          {/* <div
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          >
{`${
              initialValues
                ? t('forms:item-description-edit')
                : t('forms:item-description-add')
            } ${t('forms:withdraw-description-helper-text')}`}
            </div> */}

          <div className="w-full sm:w-8/12 md:w-2/3">
            <Label>
              {t('forms:input-label-amount')}
              <span className="ml-0.5 text-red-500">*</span>
              <span className="text-xs text-body">
                ({t('common:text-available-balance')}:
                <span className="font-bold text-accent">{shopBalance}</span>)
              </span>
            </Label>
            <Input
               labelKey={t("forms:input-label-amount")}
              {...register('amount',{required:true})}
              error={t(errors.amount?.message!)}
              variant="outline"
              className="mb-5"
            />
            <div className='mb-2 flex flex-col gap-2'>
            <span className='text-heading'>{t('forms:input-label-payment-method')}</span>
            <select
            className='w-full p-2 border border-gray-300 rounded-lg'
            {...register('payment_method', { required: true })}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
              >
              <option value=""></option>
              {Object.values(AccountTypes).map((item) => <option key={item} value={item}>{t(item)}</option>)}
            </select>
           
            </div>

            <div>
              
            <span className='text-heading'>{t('forms:input-label-details')}</span>
           
            <select className='w-full p-2 border border-gray-300 rounded-lg' {...register('details', { required: true })}>
              <option value=""></option>
              {accounts?.filter(x=>paymentMethod===x.type).map((item) => <option key={item.id} value={JSON.stringify(item.details)}>{(item.details?.name)} - {item.details?.accountNumber}</option>)}
            </select>
            </div>



            {/* <Input
              labelKey={t('forms:input-label-payment-method')}
              {...register('payment_method', { required: true })}
              error={t(errors.payment_method?.message!)}
              variant="outline"
              className="mb-5"
              required
            /> */}

            {/* <TextArea
              labelKey={t('forms:input-label-details')}
              {...register('details', { required: true })}
              variant="outline"
              className="mb-5"
            />
            */}
             <TextArea
              labelKey={t('forms:input-label-note')}
              {...register('note')}
              variant="outline"
              className="my-5"
            />
          </div>
        </div>
        
          <div className="text-end">
         
              <Button
                variant="outline"
                onClick={router.back}
                className="text-sm me-4 md:text-base"
                type="button"
              >
                {t('forms:button-label-back')}
              </Button>
            

            <Button
              loading={creating}
              disabled={creating}
              className="text-sm md:text-base"
              type="submit"
            >
              {initialValues
                ? t('forms:button-label-update-withdraw')
                : t('forms:button-label-add-withdraw')}
            </Button>
          </div>
       
      </form>
    </>
  );
}
