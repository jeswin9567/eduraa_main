import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const history = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('token');

    if (!id) {
      history('/');
      // Optionally show a session expired message
      console.log('Session expired. Please log in again.');
    }
    
  }, [history]);
};

export default useAuth;