import React from 'react';
import UserPremDHead from '../../../components/user/premium/heads/updhead';
import Usersidebrcom from '../../../components/user/premium/sidebar/usersidebar';
import WeakAreas from '../../../components/WeakAreas';
import './userboxcrs.css'
import useAuth from '../../../function/useAuth';

const AIStudentDashboard = () => {
    useAuth();
    return (
        <div>
            <UserPremDHead />
        <div className="Usrclasscomprm-container">
            <Usersidebrcom />
            <WeakAreas />
        </div>
        </div>
    );
};

export default AIStudentDashboard; 