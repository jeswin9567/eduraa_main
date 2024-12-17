import React, { useRef } from "react";
import ManPriHeader from "../../components/manager/mheads/mpricehead";
import AddPaymentOption from "../../components/manager/addprice";
import Footer from "../../components/common/footer";

const Amount = () => {
    const footerRef = useRef(null);

    const scrollToFooter = () => {
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
        <div>
            <ManPriHeader scrollToFooter={scrollToFooter} />
            <AddPaymentOption />
            <Footer ref={footerRef} />
        </div>
        </>
    );
}

export default Amount;
