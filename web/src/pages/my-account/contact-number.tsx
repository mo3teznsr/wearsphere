import { getLayout } from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import ProfileContactNumber from '@components/profile/profile-contact-number';
import ProfileForm from '@components/profile/profile-form';
import ProfileUpdateEmail from '@components/profile/profile-update-email';
import { useUser } from '@framework/auth';
import { User } from '@type/index';

export { getStaticProps } from '@framework/common.ssr';

export default function ChangeContactNumber() {
  const { me } = useUser();

  return (
    <AccountLayout>
      <div className="space-y-8">
        <div className="bg-gray-300 bg-opacity-20 rounded p-8">
          <ProfileForm user={me as User} />
        </div>

        <div className="bg-gray-300 bg-opacity-20 rounded p-8">
          <ProfileUpdateEmail user={me as User} />

          <ProfileContactNumber
            userId={me?.id!}
            profileId={me?.profile?.id!}
            contact={me?.profile?.contact!}
            variant="inline"
            labelKey="Contact"
          />
        </div>
      </div>
    </AccountLayout>
  );
}

ChangeContactNumber.authenticate = true;
ChangeContactNumber.getLayout = getLayout;
