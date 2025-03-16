import React from "react";
import UserPremDHead from '../../../components/user/premium/heads/updhead';
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import SearchResults from "../../../components/user/premium/SearchResults";
import './userboxcrs.css'
import useAuth from '../../../function/useAuth';

const SearchResultpage = () => {
    useAuth();
    return (
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <SearchResults />
            </div>
        </div>
    );
};
export default SearchResultpage;