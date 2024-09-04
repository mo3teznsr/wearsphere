import { useEffect } from 'react';
import { signOut as socialLoginSignOut } from 'next-auth/react';
import { useLogout } from '@framework/auth';
import { useAtom } from 'jotai';
import { GetStaticProps } from 'next';
import PageLoader from '@components/ui/page-loader/page-loader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { clearCheckoutAtom } from '@store/checkout';

const Logout = () => {
  const { mutate: logout } = useLogout();
  const [, resetCheckout] = useAtom(clearCheckoutAtom);

  useEffect(() => {
    (async () => {
      //@ts-ignore
      resetCheckout();
      await socialLoginSignOut({ redirect: false });
      logout();
    })();
  }, []);

  return <PageLoader />;
};

export default Logout;

export const getStaticProps: GetStaticProps = ({ locale }) => {
  return {
    props: {
      ...serverSideTranslations(locale!, ['common']),
    },
  };
};
