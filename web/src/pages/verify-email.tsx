import Button from '@components/ui/button';
import Card from '@components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import Logo from '@components/ui/logo';
import { useRouter } from 'next/router';
import Link from '@components/ui/link';
import { ROUTES } from '@lib/routes';
import { useToken } from '@lib/use-token';
import {
  useLogout,
  useResendVerificationEmail,
  useUser,
} from '@framework/auth';
import { useEffect } from 'react';

const VerifyEmail = () => {
  const { t } = useTranslation('common');
  const { getEmailVerified } = useToken();
  const router = useRouter();
  const { emailVerified } = getEmailVerified();
  const { mutate: logout, isLoading: isLogoutLoader } = useLogout();

  const { me, loading, error, isAuthorized } = useUser();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  useEffect(() => {
    if (emailVerified) {
      router.back();
    }
  }, [me, emailVerified]);

  const { mutate: verifyEmail, isLoading: isVerifying } =
    useResendVerificationEmail();

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-[#F4F6F7] py-5 px-4 md:py-8">
      <div className="max-w-[36rem]">
        <Card className="text-center !shadow-900 md:px-[4.375rem] md:py-[2.875rem]">
          <Logo />

          <h2 className="mb-5 mt-2 text-2xl font-semibold">
            {t('Email verification')}
          </h2>

          <p className="mb-16 text-lg text-[#969FAF]">
            {t('Please verify your email')}
          </p>

          <div className="space-y-3">
            <Button
              // @ts-ignore
              onClick={() => verifyEmail()}
              disabled={isVerifying || !!isLogoutLoader}
              loading={isVerifying}
              className="!h-13 w-full hover:bg-accent-hover"
            >
              {t('Resend Verification Email')}
            </Button>
            <Button
              className="!h-13 w-full hover:bg-accent-hover"
              onClick={() => handleLogout()}
              disabled={!!isVerifying || isLogoutLoader}
              loading={isLogoutLoader}
            >
              {'Logout'}
            </Button>
          </div>
          <div className="mt-4">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center text-bolder underline hover:text-body-dark hover:no-underline focus:outline-none sm:text-base"
            >
              {t('Back home')}
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};
VerifyEmail.authenticationRequired = true;
export default VerifyEmail;
