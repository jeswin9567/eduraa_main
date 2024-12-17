import React, { useEffect, useState, useRef } from 'react';
import UVLHeader from '../../../components/user/vheads/ulhead';
import HeroSection from '../../../components/common/first';
import MarginC from '../../../components/common/margin';
import Footer from '../../../components/common/footer';
import '../../../pages/admin/functionalities/aloan.css'
import { useLocation, Link } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const USearchLnResults = () => {
    useAuth();
  const query = useQuery().get('query');
  const [loans, setLoans] = useState([]); 
  const [error, setError] = useState('');

  const marginCref = useRef(null);
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch(`http://localhost:5000/searchln?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Loans');
        }
        const data = await response.json();
        setLoans(data);
        setError('');
      } catch (error) {
        setError('An error occurred while searching for Loans.');
        setLoans([]);
      }
    };

    if (query) {
      fetchLoans();
    }
  }, [query]);

  useEffect(() => {
    if (loans.length>= 0 && marginCref.current){
        marginCref.current.scrollIntoView({behavior:'smooth'})
    }
  },[loans]);

  return (
    <div>
        <UVLHeader />
        <HeroSection />
        <div className="loan-container" ref = {marginCref}>

            <MarginC/>
    

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Results */}
      <div className='loan-list'>
        {loans.length > 0 ? (
          loans.map((loan) => (
            <div key={loan._id} className='loan-item'>
              <Link to={`/uloandetails/${loan._id}`}>
                <div className='loan-name'>{loan.loanName}</div>
              </Link>
            </div>
          ))
        ) : (
          <p>No Loans found.</p>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default USearchLnResults;
