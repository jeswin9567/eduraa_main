import React from "react";
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import useAuth from "../../../function/useAuth";
import TeacherRequestBox from "../../components/manager/Teacher/Requestcomp";
import ActiveTeacherBox from "../../components/manager/Teacher/Teacherbox";
import UserBox from "../../components/manager/User/userbox";
import './mhome.css';

function Mhome()
{

    useAuth();


    return(
        <>
        <div>
            <ManHomHeader />
            <div className="mhomevisible-container">
            <Managersidebrcom />
            <TeacherRequestBox />
            <ActiveTeacherBox />
            <UserBox />
            </div>
        </div>
        </>
    );
}

export default Mhome;