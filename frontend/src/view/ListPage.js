import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function ListPage() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await fetch('https://image-webapp.onrender.com//lists/all', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const result = await response.json();
                if (result.success) {
                    setLists(result.lists);
                } else {
                    toast.error('Failed to fetch lists');
                }
            } catch (err) {
                toast.error('Error fetching lists');
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, []);

    const handleDelete = async (listId) => {
        try {
            const response = await fetch(`https://image-webapp.onrender.com//lists/${listId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const result = await response.json();
            if (result.success) {
                toast.success('List deleted successfully');
                setLists(lists.filter(list => list._id !== listId)); 
            } else {
                toast.error('Failed to delete list');
            }
        } catch (err) {
            toast.error('Error deleting list');
        }
    };

    const handleEdit = (listId) => {
        navigate(`/edit-list/${listId}`);
    };

    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <div className="container mt-5" style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <h1 className="text-center mb-4">Saved Lists</h1>

            <button
                onClick={handleBack}
                className="btn btn-secondary mb-4"
                style={{
                    padding: '8px 16px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: 'none',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '200px',
                }}
            >
                Back
            </button>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <table className="table table-bordered table-hover table-striped shadow-sm">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="px-3 py-2">List Name</th>
                                    <th className="px-3 py-2">Response Code</th>
                                    <th className="px-3 py-2">Create Time</th>
                                    <th className="px-3 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.length > 0 ? (
                                    lists.map((list) => (
                                        <tr key={list._id} style={{ padding: '10px' }}>
                                            <td className="px-3 py-2">{list.name}</td>
                                            <td className="px-3 py-2">{list.filter}</td>
                                            <td className="px-3 py-2">{new Date(list.createdAt).toLocaleString()}</td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    padding: '10px 15px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                    gap: '10px',
                                                }}
                                            >
                                                <button
                                                    style={{
                                                        backgroundColor: '#17a2b8', 
                                                        color: 'white',
                                                        padding: '5px 10px',
                                                        fontSize: '14px',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        maxWidth: '150px', 
                                                    }}
                                                    onClick={() => handleEdit(list._id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: '#dc3545', 
                                                        color: 'white',
                                                        padding: '5px 10px',
                                                        fontSize: '14px',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        maxWidth: '150px', 
                                                    }}
                                                    onClick={() => handleDelete(list._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center px-3 py-2">
                                            No lists saved yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <ToastContainer position="bottom-center" autoClose={3000} />
        </div>
    );
}

export default ListPage;
