import React, { useRef } from "react";
import UMockHeader from "../../components/user/vheads/mockhead";
import UMockEntranceExamList from "../../components/user/ViewMocktest";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const UserViewMockTest = () => {
    useAuth();
    const footerRef = useRef(null); // Create a ref for the footer

    return (
        <>
            <div>
                <UMockHeader scrollToContact={() => footerRef.current.scrollIntoView({ behavior: 'smooth' })} />
                <UMockEntranceExamList />
                <Footer ref={footerRef} /> {/* Pass the ref to Footer */}
            </div>
        </>
    );
};

export default UserViewMockTest;
