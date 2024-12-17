import React, {useRef}from "react";
import Profile from "../../components/user/profile";
import UPHead from "../../components/user/profilehead";
import AboutSection from "../../components/common/About";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

function UVProfile() {
    useAuth();
    const footerRef=useRef(null)
    const AboutRef = useRef(null)

    const scrollToContact = () =>{
        footerRef.current?.scrollIntoView({behavior:'smooth'});
    };

    const scrollToAbout = () => {
        AboutRef.current?.scrollIntoView({behavior:'smooth'})
    }
    return(
        <>
        <div>
            <UPHead scrollToContact={scrollToContact} scrollToAbout={scrollToAbout}/>
            <Profile />
            <AboutSection ref ={AboutRef}/>
            <Footer ref={footerRef}/>
        </div>
        </>
    );
}

export default UVProfile;