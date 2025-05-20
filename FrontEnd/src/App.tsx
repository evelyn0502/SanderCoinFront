
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Payment from './pages/Payment';  
import AuthProvider  from './pages/AuthContext';
import Transfer from './pages/Transfer';
import Sell from './pages/Sell';
import AboutUs from './pages/AboutUs';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />
          <Route path="/register" element={
            <MainLayout>
              <Register />
            </MainLayout>
          } />
          <Route path="/login" element={
            <MainLayout>
              <Login/>
            </MainLayout>
          } />
          <Route path="/payment" element={
            <MainLayout>
              <Payment/>
            </MainLayout>
          } />
          <Route path="/transfer" element={
            <MainLayout>
              <Transfer/>
            </MainLayout>
          } />
          <Route path="/sell" element={
            <MainLayout>
              <Sell/>
            </MainLayout>
          } />
          <Route path="/aboutus" element={
            <MainLayout>
              <AboutUs/>
            </MainLayout>
          } />
          <Route path="/about" element={
            <Navigate to="/" replace />
          } />
          <Route path="/team" element={
            <Navigate to="/" replace />
          } />
          <Route path="*" element={
            <MainLayout>
              <div className="not-found">
                <h2>Página no encontrada</h2>
                <p>La página que estás buscando no existe.</p>
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;