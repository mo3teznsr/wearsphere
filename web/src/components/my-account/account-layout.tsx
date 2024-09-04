import Subscription from '@components/common/subscription';
import AccountNav from '@components/my-account/account-nav';
import AccountNavMobile from '@components/my-account/account-nav-mobile';
import Container from '@components/ui/container';
import PageHeader from '@components/ui/page-header';
import { siteSettings } from '@settings/site.settings';

const AccountLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const { accountMenu } = siteSettings;
  return (
    <>
      {/* <PageHeader pageHeader="text-page-my-account" /> */}
      <div className="2xl:px-2 bg-[#F7F8FA] ">
        <div className="flex w-full min-h-screen   md:flex-row relative">
          <div className="flex flex-col w-full 2xl:flex-row ">
            <div className="2xl:hidden">
              <AccountNavMobile options={accountMenu} />
            </div>
            <div className="flex-shrink-0 bg-white ltr:border-r rtl:border-l px-2 border-slate-300 hidden pb-2 2xl:block 2xl:pb-0 w-[16.75rem] sticky top-0 left-0">
              <div className="relative h-full">
                <AccountNav options={accountMenu} />
                {/* <div className="absolute top-0 -right-16 w-px h-full bg-[#E6E6E6]"></div> */}
              </div>
            </div>
            <div className="mt-6  p-4  2xl:mt-0 w-full h-full">
              {children}</div>
          </div>
        </div>

        {/* <Subscription /> */}
      </div>
    </>
  );
};

export default AccountLayout;
