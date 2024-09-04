// hoc/withAuth.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function withAuth<P>(Component: React.ComponentType<any>) {
  const AuthenticatedComponent = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log('session',session);
    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) router.push('/login'); // Redirect if no session
    
    }, [session, status, router]);

    if (status === 'loading' || !session) {
      return <div>Loading...</div>; // Loading state or redirecting
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}

export default withAuth;
