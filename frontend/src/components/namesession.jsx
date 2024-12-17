import React from "react";

const SessEmail = () => {
    const emailtoken = localStorage.getItem('userEmail')
    return (
        <>
        <div>
            {emailtoken}
        </div>
        </>
    );
}

export default SessEmail;