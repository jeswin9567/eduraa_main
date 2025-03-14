import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './updhead.css';
import { FaSearch, FaMicrophone } from 'react-icons/fa';

const UserPremDHead = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const userEmail = localStorage.getItem("userEmail");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceActive, setVoiceActive] = useState(false);
    const audioRef = useRef(null);

    // Create audio context for visualization
    const [audioContext, setAudioContext] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [microphone, setMicrophone] = useState(null);
    const canvasRef = useRef(null);

    // Voice Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        // Initialize audio context
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        const analyserNode = context.createAnalyser();
        setAnalyser(analyserNode);
    }, []);

    useEffect(() => {
        if (userEmail) {
            axios.get(`http://localhost:5000/user/user-details?email=${userEmail}`)
                .then(response => {
                    setUserName(response.data.name);
                })
                .catch(error => {
                    console.error("Error fetching user details:", error);
                });
        }
    }, [userEmail]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); 
        navigate('/');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setShowSearch(false);
        setIsSearching(true);

        try {
            const response = await axios.get(`http://localhost:5000/api/search/search`, {
                params: {
                    query: searchQuery,
                    userEmail: userEmail
                }
            });
            navigate('/query/search-results', { state: { results: response.data } });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                document.querySelector('.search-input')?.focus();
            }, 100);
        }
    };

    if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            setSearchQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
    }

    const toggleVoiceSearch = () => {
        if (recognition) {
            if (isListening) {
                recognition.stop();
                setIsListening(false);
                if (searchQuery.trim()) {
                    handleSearch({ preventDefault: () => {} });
                }
            } else {
                setSearchQuery('');
                recognition.start();
                setIsListening(true);
            }
        } else {
            alert('Speech recognition is not supported in your browser');
        }
    };

    return (
        <div className="uprmdhead-container">
            <div className="uprmdheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="uprmdhead-userinfo">
                <div className="search-section">
                    <button className="search-icon-button" onClick={toggleSearch}>
                        {isSearching ? <span className="loading-spinner" /> : <FaSearch />}
                    </button>
                    {showSearch && (
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                className="search-input"
                                placeholder={isListening ? 'Listening...' : 'Search or press mic to speak...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className={`voseacive-button ${isListening ? 'voseacive-listening' : ''}`}
                                onClick={toggleVoiceSearch}
                                title={isListening ? 'Stop listening' : 'Start voice search'}
                            >
                                <FaMicrophone />
                            </button>
                        </form>
                    )}
                </div>
                <div className="user-avatar" onClick={() => navigate('/uvpro')}>
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <p className="user-name" onClick={() => navigate('/uvpro')}>
                    {userName || "User"}
                </p>
                <button className="uprmdheadlogbtn" onClick={logout}>Log Out</button>
            </div>
            <audio ref={audioRef} src="/sounds/mic-start.mp3" />
        </div>
    );
};

export default UserPremDHead;
