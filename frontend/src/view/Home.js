import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navbar}>
                <div style={styles.navbarBrand}>Image</div>
                <div style={styles.navLinks}>
                    <button
                        style={styles.navButton}
                        onClick={() => navigate('/search')}
                    >
                        Search Page
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => navigate('/lists')}
                    >
                        List Page
                    </button>
                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div style={styles.mainContent}>
                <div style={styles.card}>
                    <h1 style={styles.welcomeMessage}>Welcome, {loggedInUser}!</h1>
                    <p style={styles.welcomeDescription}>
                        Explore our features and manage your lists.
                    </p>
                    <div style={styles.featureButtons}>
                        <button onClick={() => navigate('/search')} style={styles.navigationButton}>
                            Go to Search Page
                        </button>
                        <button onClick={() => navigate('/lists')} style={styles.navigationButton}>
                            Go to List Page
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

// Styles for the page
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        width:'100vw',
        // backgroundImage: 'url("https://via.placeholder.com/1920x1080")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    },
    navbar: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '1000',
    },
    navbarBrand: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
    },
    navLinks: {
        display: 'flex',
        gap: '15px',
    },
    navButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid white',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s, color 0.3s',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 'calc(100vh - 70px)', 
        width: '100%',
        textAlign: 'center',
        padding: '20px',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        borderRadius: '10px',
        padding: '40px 30px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '450px',
    },
    welcomeMessage: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
    },
    welcomeDescription: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '30px',
    },
    featureButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    navigationButton: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
        width: '100%',
    },
};

export default Home;
