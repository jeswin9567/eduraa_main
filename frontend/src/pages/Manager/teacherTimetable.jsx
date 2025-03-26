import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import TeacherTimetable from "../../components/manager/Teacher/Timetable";
import './ViewPrice.css'

const TimetablePage = () =>  {
    return (
        <>
        <diV>
            <ManagerDashHead />
            <div className="manviewpricelist-container">
                <Managersidebrcom/>
                <TeacherTimetable />
            </div>
        </diV>
        </>
    );
};

export default TimetablePage;