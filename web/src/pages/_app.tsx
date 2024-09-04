import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedModal from '@components/common/modal/managed-modal';
import ManagedDrawer from '@components/ui/drawer/managed-drawer';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ToastContainer } from 'react-toastify';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import DefaultSeo from '@components/common/default-seo';

// Load Open Sans and satisfy typeface font
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/satisfy';
// external
import 'react-toastify/dist/ReactToastify.css';
// base css file
import '@styles/scrollbar.css';
import '@styles/swiper-carousel.css';
import '@styles/custom-plugins.css';
import '@styles/tailwind.css';
import { getDirection } from '@utils/get-direction';
import PageLoader from '@components/ui/page-loader/page-loader';
import ErrorMessage from '@components/ui/error-message';
import { SettingsProvider } from '@contexts/settings.context';
import { useSettings } from '@framework/settings';
import type { NextPage } from 'next';
import PrivateRoute from '@lib/private-route';
import SocialLoginProvider from '@providers/social-login-provider';
import { SessionProvider } from 'next-auth/react';
import Maintenance from '@components/maintenance/layout';
function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 });
  }
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
  authenticate?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const AppSettings: React.FC<{ children?: React.ReactNode }> = (
  props,
) => {
  const { data, isLoading: loading, error } = useSettings();
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.options} {...props} />;
};

function CustomApp({
  Component,
  pageProps: {
    //@ts-ignore
    session,
    ...pageProps
  },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authProps = Component.authenticate ?? false;

  const [queryClient] = useState(() => new QueryClient());

  const router = useRouter();
  const dir = getDirection(router.locale);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  return (
    <AnimatePresence initial={false} onExitComplete={handleExitComplete}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <AppSettings>
              <ManagedUIContext>
                <DefaultSeo />
                <Maintenance>
                  {Boolean(authProps) ? (
                    <PrivateRoute>
                      {getLayout(<Component {...pageProps} />)}
                    </PrivateRoute>
                  ) : (
                    getLayout(<Component {...pageProps} />)
                  )}
                </Maintenance>
                <ToastContainer autoClose={2000} theme="colored" />
                <SocialLoginProvider />
                <ManagedModal />
                <ManagedDrawer />
              </ManagedUIContext>
            </AppSettings>
          </Hydrate>
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
      </SessionProvider>
    </AnimatePresence>
  );
}

export default appWithTranslation(CustomApp);
