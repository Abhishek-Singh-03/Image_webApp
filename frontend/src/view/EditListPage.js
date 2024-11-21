import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function EditListPage() {
    const { id } = useParams(); 
    const [list, setList] = useState(null);
    const [name, setName] = useState('');
    const [filter, setFilter] = useState('');
    const [images, setImages] = useState([]);
    const [created, setCreated] = useState('');
    const [loading, setLoading] = useState(true);
    const [nameError, setNameError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await fetch(`https://image-webapp.onrender.com/lists/single/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const result = await response.json();
                if (result.success) {
                    const { name, filter, images, createdAt } = result.list;
                    setList(result.list);
                    setName(name);
                    setFilter(filter);
                    setImages(images);
                    setCreated(createdAt);
                } else {
                    toast.error('Failed to fetch list data');
                }
            } catch (err) {
                toast.error('Error fetching list data');
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [id]);

    const handleSave = async () => {
        if (name.trim() === '') {
            setNameError('List name cannot be empty.');
            return;
        } else {
            setNameError('');
        }

        try {
            const response = await fetch(`https://image-webapp.onrender.com/lists/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    filter,
                    images,
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('List updated successfully');
                navigate('/lists');
            } else {
                toast.error('Failed to update list');
            }
        } catch (err) {
            toast.error('Error updating list');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this list?');
        if (confirmDelete) {
            try {
                const response = await fetch(`https://image-webapp.onrender.com//lists/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const result = await response.json();
                if (result.success) {
                    toast.success('List deleted successfully');
                    navigate('/lists');
                } else {
                    toast.error('Failed to delete list');
                }
            } catch (err) {
                toast.error('Error deleting list');
            }
        }
    };

    const handleCopyToClipboard = () => {
        const textToCopy = images.join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Image URLs copied to clipboard!');
        }).catch((err) => {
            toast.error('Failed to copy URLs');
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Edit List</h1>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="form-group mb-3">
                        <label htmlFor="name" className="form-label">
                            List Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter list name"
                        />
                        {nameError && <div className="text-danger">{nameError}</div>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="filter" className="form-label">Response Code</label>
                        <input
                            id="filter"
                            type="text"
                            className="form-control"
                            value={filter}
                            disabled
                            placeholder="Response code (readonly)"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="created" className="form-label">Created At</label>
                        <input
                            id="created"
                            type="text"
                            className="form-control"
                            value={new Date(created).toLocaleString()}
                            disabled
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="images" className="form-label">
                            Images (URLs)
                            <Link
                                className="btn btn-link p-0 ms-2"
                                type="button"
                                onClick={handleCopyToClipboard}
                                style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                copy
                                <i className="bi bi-clipboard"></i>
                            </Link>
                        </label>
                        <textarea
                            id="images"
                            className="form-control"
                            rows="4"
                            value={images.join('\n')}
                            onChange={(e) => setImages(e.target.value.split('\n'))}
                            placeholder="Enter image URLs, one per line"
                            disabled
                        />
                    </div>

                    <div>
                        {images.length > 0 && (
                            <div>
                                <h5>Image Previews:</h5>
                                {images.map((image, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center">
                                        <img src={image} alt={`Image ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        className="btn btn-primary w-100 py-2 mt-3"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>

                    <button
                        className="btn btn-danger w-100 py-2 mt-3"
                        onClick={handleDelete}
                    >
                        Delete List
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default EditListPage;
