import Header from '@components/layout/header/header';
import Footer from '@components/layout/footer/footer';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import Search from '@components/common/search';
import { authorizationAtom } from '@store/authorization-atom';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '@lib/routes';
import { getAuthCredentials } from '@lib/auth-utils';
import { siteSettings } from '@settings/site.settings';
import { WhatsappIcon } from 'react-share';

const SiteLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isAuthorize] = useAtom(authorizationAtom);
  const router=useRouter();
  const generateRedirectUrl =
  router.locale !== siteSettings.defaultLanguage
      ? `/${router.locale}${ROUTES.LOGIN}`
      : ROUTES.LOGIN;

 

  useEffect(() => {
    console.log("isAuthorize",isAuthorize)
    if (!isAuthorize ) {
      router.replace(generateRedirectUrl);
      };
    
  }, [isAuthorize]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="relative flex-grow"
        style={{
          minHeight: '-webkit-fill-available',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileNavigation />
      <div className="fixed hidden xl:flex xl:bottom-3 bottom-16 rounded-full   left-3 z-20">
       
        <WhatsappIcon onClick={()=>window.open(`https://wa.me/${siteSettings.whatsapp}`)} className='w-8 h-8 xl:h-14 xl:w-14  rounded-full'/>
      
      </div>
      <Search />
    </div>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);

export default SiteLayout;
