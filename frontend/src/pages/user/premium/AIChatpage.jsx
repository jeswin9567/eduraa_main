import React from 'react';
import UserPremDHead from '../../../components/user/premium/heads/updhead';
import Usersidebrcom from '../../../components/user/premium/sidebar/usersidebar';
import AiChat from '../../../components/user/premium/AiChat';
import './dashbd.css';

const AIChatPage = () => {
  return (
    <>
    <div>
        <UserPremDHead />
        <div className='userdashbbprm-containerrr'>
            <Usersidebrcom />
            <AiChat />
        </div>
    </div>
    </>
  );
}

export default AIChatPage;
