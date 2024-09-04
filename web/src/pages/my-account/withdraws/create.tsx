import { useTranslation } from 'next-i18next';



import { Routes } from '@/config/routes';

import { useRouter } from 'next/router';
import AccountLayout from '@components/my-account/account-layout';
import CreateOrUpdateWithdrawForm from '@components/withdraw/withdraw-form';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getLayout } from '@components/layout/layout';

export default function CreateWithdrawPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = useRouter();




  return (
    <AccountLayout>
    <div className='bg-white m-4 p-4 rounded-lg'>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('text-add-withdraw')}
        </h1>
      </div>
      
      <CreateOrUpdateWithdrawForm />
    </div>
    </AccountLayout>
  );
}

CreateWithdrawPage.getLayout = getLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['forms', 'common'])),
  },
});
