import { useEffect } from 'react';
import { useRouter } from 'next/router';
import JsCookies from 'js-cookie';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    
    JsCookies.remove('admin_type');

    
    router.push('/', undefined, { shallow: true });
  }, []);

  return (
    <div>
      <p>Logging out...</p>
      
    </div>
  );


};

export default LogoutPage;
