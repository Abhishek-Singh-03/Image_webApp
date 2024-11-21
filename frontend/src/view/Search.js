import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function SearchPage() {
    const [filter, setFilter] = useState('');
    const [dogImages, setDogImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate(); 

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const convertFilterToPattern = (filter) => {
        return filter.replace(/x/g, '\\d');
    };

    const validStatusCodes = [
        100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
        301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410,
        411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
        500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511
    ];

    const fetchImages = async () => {
        try {
            if (!filter) {
                toast.error('Please provide a valid filter');
                return;
            }
    
            const regexPattern = convertFilterToPattern(filter);
    
            let imageUrls = [];
            
            const exactMatchCode = parseInt(filter);
            if (!isNaN(exactMatchCode) && validStatusCodes.includes(exactMatchCode)) {
                const url = `https://http.dog/${exactMatchCode}.jpg`;
                const response = await fetch(url);
                if (response.ok) {
                    imageUrls.push(url);
                }
            } else {
                const startCode = parseInt(regexPattern.charAt(0) + "00");
                const endCode = parseInt(regexPattern.charAt(0) + "99");
    
                for (let code = startCode; code <= endCode; code++) {
                    if (!validStatusCodes.includes(code)) {
                        continue;
                    }
    
                    const url = `https://http.dog/${code}.jpg`;
                    const response = await fetch(url);
    
                    if (response.ok) {
                        imageUrls.push(url);
                    }
                }
            }
    
            if (imageUrls.length > 0) {
                setDogImages(imageUrls);
                setCurrentImageIndex(0);
            } else {
                toast.error('No images found for the given filter');
            }
        } catch (err) {
            toast.error('Error fetching data');
        }
    };
    

    const saveImage = async (imageUrl) => {
        try {
            const imageCode = parseInt(imageUrl.split('/').pop().split('.jpg')[0]);
            const list = {
                name: `List for ${imageCode}`,
                filter: imageCode,
                images: [imageUrl], 
                createdAt: new Date().toISOString(),
            };

            const response = await fetch('http://localhost:8080/lists/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(list),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Image saved successfully!');
            } else {
                toast.error('Failed to save image');
            }
        } catch (err) {
            toast.error('Error saving image');
        }
    };

    const nextImage = () => {
        if (currentImageIndex < dogImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0); 
        }
    };

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(dogImages.length - 1); 
        }
    };

    
    const handleCheckSavedLists = () => {
        navigate('/lists'); 
    };

    return (
        <div className="container mt-5" style={styles.container}>
            <h1 className="text-center mb-4">Search Dog Images by Response Code</h1>
            
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                    <div className="form-group">
                        <label htmlFor="filter" style={styles.label}>Filter by Response Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="filter"
                            value={filter}
                            onChange={handleFilterChange}
                            placeholder="e.g., 2xx, 203, 404, 20x"
                            style={styles.input}
                        />
                    </div>
                    <button className="btn btn-primary mt-3 w-100" onClick={fetchImages} style={styles.button}>
                        Fetch Images
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {dogImages.length > 0 ? (
                    <div>
                        <h3 className="text-center mb-3">Images:</h3>

                        <div id="dogCarousel" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img 
                                        src={dogImages[currentImageIndex]} 
                                        alt="Dog" 
                                        className="d-block w-100 rounded"
                                        style={styles.carouselImage}
                                    />
                                </div>
                            </div>

                            <button className="carousel-control-prev" onClick={prevImage} style={styles.carouselControl}>
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" onClick={nextImage} style={styles.carouselControl}>
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <button
                                className="btn btn-success"
                                onClick={() => saveImage(dogImages[currentImageIndex])}
                                style={styles.saveButton}
                            >
                                Save Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h5>No images found. Try searching with a valid filter.</h5>
                    </div>
                )}
            </div>

            <div className="text-center mt-4">
                <button 
                    className="btn btn-secondary"
                    onClick={handleCheckSavedLists}
                    style={styles.checkSavedButton}
                >
                    Check Saved Lists
                </button>
            </div>

            <ToastContainer />
        </div>
    );
}

// Styles
const styles = {
    container: {
        maxWidth: '90vw',
        margin: '0 auto',
        marginTop: '120px',
        textAlign: 'center',
    },
    label: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '20px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '12px 18px',
        fontSize: '16px',
        borderRadius: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    carouselImage: {
        objectFit: 'cover',
        maxHeight: '400px',
        width: '100%',
        height: 'auto',
        margin: '0 auto',
    },
    carouselControl: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        padding: '10px',
    },
    saveButton: {
        padding: '12px 18px',
        fontSize: '16px',
        borderRadius: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    checkSavedButton: {
        padding: '12px 18px',
        fontSize: '16px',
        borderRadius: '10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default SearchPage;
