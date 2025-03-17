import React from 'react';
import UserPremDHead from '../../../components/user/premium/heads/updhead';
import Usersidebrcom from '../../../components/user/premium/sidebar/usersidebar';
import AiChat from '../../../components/user/premium/AiChat';
import './AIChatpage.css';
import useAuth from "../../../../function/useAuth";

const AIChatPage = () => {
    useAuth();
  return (
    <>
    <div>
        <UserPremDHead />
        <div className='aichat-userdashbbprm-containerrr'>
            <Usersidebrcom />
            <AiChat />
        </div>
    </div>
    </>
  );
}

export default AIChatPage;
