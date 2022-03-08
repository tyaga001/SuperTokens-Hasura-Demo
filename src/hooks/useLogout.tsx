import { signOut } from 'supertokens-auth-react/recipe/emailpassword';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  return handleLogout;
}
