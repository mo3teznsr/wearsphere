import CreateOrUpdateProductForm from "@/components/product/product-form"
import { useTranslation } from "react-i18next";
import Layout from '@/components/layouts/admin';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";




const CreateProductPage =()=>{
    const { t } = useTranslation();

    return <>
    <div className="flex items-center gap-5 border-b border-dashed border-border-base py-5 sm:py-8">
        <h4 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-product')}
        </h4>
      </div>
    <CreateOrUpdateProductForm />
    </>
}
CreateProductPage.Layout=Layout
export default CreateProductPage
export const getServerSideProps = async ({ locale }: any) => ({
    props: {
      ...(await serverSideTranslations(locale, ['common', 'form'])),
    },
  });
  