import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './view/Login';
import Signup from './view/Signup';
import Home from './view/Home';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import SearchPage from './view/Search';
import ListPage from './view/ListPage';
import EditListPage from './view/EditListPage';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        {/* <Route path='/home' element={<Home />} /> */}
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
        {/* <Route path="/lists" element={<ListPage />} /> */}
                {/* <Route path="/edit-list/:listId" element={<EditList />} /> */}
        <Route path="/search" element={<PrivateRoute element={<SearchPage />} />} />
        <Route path="/lists" element={<PrivateRoute element={<ListPage />} />} />
        <Route path="/edit-list/:id" element={<EditListPage />} /> 
      </Routes>
    </div>
  );
}

export default App;