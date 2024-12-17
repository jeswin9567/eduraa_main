import React, { useEffect, useState, useRef } from 'react';
import UVSHeader from '../../../components/user/vheads/shead';
import HeroSection from '../../../components/common/first';
import MarginCScho from '../../../components/common/marginscho';
import Footer from '../../../components/common/footer';
import '../../../pages/admin/functionalities/ascholar.css'
import { useLocation, Link } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const USearchSchoResults = () => {
    useAuth();
  const query = useQuery().get('query');
  const [scholarships, setScholarships] = useState([]); 
  const [error, setError] = useState('');

  const marginCref = useRef(null);
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch scholarships');
        }
        const data = await response.json();
        setScholarships(data);
        setError('');
      } catch (error) {
        setError('An error occurred while searching for scholarships.');
        setScholarships([]);
      }
    };

    if (query) {
      fetchScholarships();
    }
  }, [query]);

  useEffect(() => {
    if (scholarships.length>= 0 && marginCref.current){
        marginCref.current.scrollIntoView({behavior:'smooth'})
    }
  },[scholarships]);

  return (
    <div>
        <UVSHeader />
        <HeroSection />
        <div className="scholar-container" ref = {marginCref}>

            <MarginCScho/>
    

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search Results */}
      <div className='scholarship-list'>
        {scholarships.length > 0 ? (
          scholarships.map((scholarship) => (
            <div key={scholarship._id} className='scholarship-item'>
              <Link to={`/uscholarshipdetails/${scholarship._id}`}>
                <div className='scholarship-name'>{scholarship.name}</div>
                <div className="scholarship-dates">
                            {scholarship.startdate && scholarship.enddate
                                ? `${new Date(scholarship.startdate).toLocaleDateString()} - ${new Date(scholarship.enddate).toLocaleDateString()}`
                                : 'Dates not available'}
                        </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No scholarships found.</p>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default USearchSchoResults;
