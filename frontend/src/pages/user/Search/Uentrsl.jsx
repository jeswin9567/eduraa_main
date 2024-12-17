import React, { useEffect, useState, useRef } from 'react';
import UEVHeader from '../../../components/user/vheads/uehead';
import HeroSection from '../../../components/common/first';
import MarginCEntr from '../../../components/common/marginen';
import Footer from '../../../components/common/footer';
import '../../../pages/admin/functionalities/aentrance.css'
import { useLocation, Link } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const USearchEntrResults = () => {
    useAuth();
  const query = useQuery().get('query');
  const [entrances, setEntrances] = useState([]); 
  const [error, setError] = useState('');

  const marginCref = useRef(null);
  useEffect(() => {
    const fetchEntrances = async () => {
      try {
        const response = await fetch(`http://localhost:5000/searchentr?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Entrances');
        }
        const data = await response.json();
        setEntrances(data);
        setError('');
      } catch (error) {
        setError('An error occurred while searching for Entrances.');
        setEntrances([]);
      }
    };

    if (query) {
      fetchEntrances();
    }
  }, [query]);

  useEffect(() => {
    if (entrances.length>= 0 && marginCref.current){
        marginCref.current.scrollIntoView({behavior:'smooth'})
    }
  },[entrances]);

  return (
    <div>
        <UEVHeader />
        <HeroSection />
        <div className="entrance-container" ref = {marginCref}>

            <MarginCEntr/>
    

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Results */}
      <div className='entrance-list'>
        {entrances.length > 0 ? (
          entrances.map((entrance) => (
            <div key={entrance._id} className='entrance-item'>
              <Link to={`/uentrancedetails/${entrance._id}`}>
                <div className='entrance-name'>{entrance.name}</div>
                <div className="entrance-dates">
                            {entrance.startdate && entrance.enddate
                                ? `${new Date(entrance.startdate).toLocaleDateString()} - ${new Date(entrance.enddate).toLocaleDateString()}`
                                : 'Dates not available'}
                        </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No Entrances found.</p>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default USearchEntrResults;
