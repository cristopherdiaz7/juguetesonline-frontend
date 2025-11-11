import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DebugApi from './components/DebugApi';
import BusquedaGlobal from './views/BusquedaGlobal';
import Login from './views/Login';
import Register from './views/Register';
import Logout from './views/Logout';
import CategoriaFiguras from './views/CategoriaFiguras';
import CategoriaPeluches from './views/CategoriaPeluches';
import CategoriaPosters from './views/CategoriaPosters';
import CategoriaRetro from './views/CategoriaRetro';
import CategoriaVehiculos from './views/CategoriaVehiculos';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './views/Cart';
import AdminDashboard from './views/AdminDashboard';
import Usuarios from './views/Usuarios';
import MyOrders from './views/MyOrders';
import ChangePassword from './views/ChangePassword';
import './App.css';

import Navbar from './components/Navbar';
import NotificationsToast from './components/NotificationsToast';

function App() {
  return (
    <>
      <NotificationsToast />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/categoria/figuras" element={<CategoriaFiguras />} />
        <Route path="/categoria/peluches" element={<CategoriaPeluches />} />
        <Route path="/categoria/posters" element={<CategoriaPosters />} />
        <Route path="/categoria/retro" element={<CategoriaRetro />} />
        <Route path="/categoria/vehiculos" element={<CategoriaVehiculos />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/usuarios" element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        } />
        <Route path="/buscar" element={<BusquedaGlobal />} />
  <Route path="/debug" element={<DebugApi />} />
        <Route path="/mis-pedidos" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path="/cambiar-contrasena" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
      </Routes>
        {/* Footer de referencias */}
        <footer className="bg-light text-center text-lg-start mt-5 border-top pt-4" style={{fontSize: '1rem'}}>
          <div className="container p-3">
            <div className="row">
              <div className="col-md-4 mb-3 mb-md-0">
                <h6 className="text-uppercase fw-bold mb-2">Contacto</h6>
                <p className="mb-1">Email: <a href="mailto:info@juguetesonline.com">info@juguetesonline.com</a></p>
                <p className="mb-1">Teléfono: <a href="tel:+5491123456789">+54 9 11 2345-6789</a></p>
                <p className="mb-0">Dirección: Av. Siempreviva 123, Buenos Aires</p>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <h6 className="text-uppercase fw-bold mb-2">Redes Sociales</h6>
                <a href="https://www.instagram.com/juguetesonline" target="_blank" rel="noopener noreferrer" className="me-2">Instagram</a>
                <a href="https://www.facebook.com/juguetesonline" target="_blank" rel="noopener noreferrer" className="me-2">Facebook</a>
                <a href="https://wa.me/5491123456789" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
              <div className="col-md-4">
                <h6 className="text-uppercase fw-bold mb-2">Aviso Legal</h6>
                <p className="mb-1">© {new Date().getFullYear()} JuguetesOnline. Todos los derechos reservados.</p>
                <p className="mb-0">Sitio web sin fines comerciales. Proyecto educativo.</p>
              </div>
            </div>
          </div>
        </footer>
    </>
  );
}

export default App;
