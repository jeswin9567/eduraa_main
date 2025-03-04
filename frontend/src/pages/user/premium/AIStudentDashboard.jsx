import React from 'react';
import UserPremDHead from '../../../components/user/premium/heads/updhead';
import Usersidebrcom from '../../../components/user/premium/sidebar/usersidebar';
import WeakAreas from '../../../components/WeakAreas';
import './userboxcrs.css'

const AIStudentDashboard = () => {
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