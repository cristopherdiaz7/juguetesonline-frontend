import React from 'react';
import './BusquedaGlobal.css';
import { useLocation, Link } from 'react-router-dom';

// Lista global de productos (puedes mover esto a un archivo aparte si lo prefieres)
const productos = [
  { id: 'spiderman', name: 'Spiderman Titan Hero Figura De 30 Cm.', price: 52000, categoria: 'figuras', image: require('../assets/spiderman.jpg') },
  { id: 'deadpool', name: 'Figura Articulado De Marvel Deadpool 30 Cm', price: 46000, categoria: 'figuras', image: require('../assets/deadpool.jpg') },
  { id: 'iroman', name: 'Figura Articulada Iron Man 30 Cm', price: 50000, categoria: 'figuras', image: require('../assets/iroman.jpg') },
  { id: 'grogu', name: 'Muñeco Soft Star Wars Grogu 35 cm', price: 39200, categoria: 'figuras', image: require('../assets/grogu.jpg') },
  { id: 'batman', name: 'Figura Batman Dc Articulada 24 Cm', price: 27000, categoria: 'figuras', image: require('../assets/batman.jpg') },
  { id: 'messi', name: 'Muñeco coleccionable AFA Messi versión Copa América', price: 38000, categoria: 'figuras', image: require('../assets/messi.jpg') },
  { id: 'posterbatman', name: 'Póster Batman Edición Limitada', price: 12000, categoria: 'posters', image: require('../assets/posterbatman.jpg') },
  { id: 'strangerthings', name: 'Póster Stranger Things Edición Limitada', price: 14500, categoria: 'posters', image: require('../assets/strangerthings.jpg') },
  { id: 'venom', name: 'Póster Venom Edición Limitada', price: 13000, categoria: 'posters', image: require('../assets/venom.jpg') },
  { id: 'harrypotter', name: 'Póster Harry Potter Edición Limitada', price: 15000, categoria: 'posters', image: require('../assets/harrypotter.jpg') },
  { id: 'naruto', name: 'Póster Naruto Edición Limitada', price: 13500, categoria: 'posters', image: require('../assets/naruto.jpg') },
  { id: 'hulkcomics', name: 'Póster Hulk Comics Edición Limitada', price: 12500, categoria: 'posters', image: require('../assets/hulkcomics.jpg') },
  { id: 'tromporetro', name: 'Trompo Retro Edición Limitada', price: 8500, categoria: 'retro', image: require('../assets/tromporetro.jpg') },
  { id: 'barbieretro', name: 'Barbie Retro Edición Limitada', price: 19000, categoria: 'retro', image: require('../assets/barbieretro.jpg') },
  { id: 'motoplasticoretro', name: 'Moto Plástico Retro Edición Limitada', price: 15500, categoria: 'retro', image: require('../assets/motoplasticoretro.jpg') },
  { id: 'soldaditosretro', name: 'Soldaditos Retro Edición Limitada', price: 10000, categoria: 'retro', image: require('../assets/soldaditosretro.jpg') },
  { id: 'starwars', name: 'Star Wars Retro Edición Limitada', price: 22000, categoria: 'retro', image: require('../assets/starwars.jpg') },
  { id: 'pistoladeagua', name: 'Pistola de Agua Retro Edición Limitada', price: 9000, categoria: 'retro', image: require('../assets/pistoladeagua.jpg') },
  { id: 'hellokitty', name: 'Peluche Hello Kitty Edición Limitada', price: 25000, categoria: 'peluches', image: require('../assets/hellokitty.jpg') },
  { id: 'stitch', name: 'Peluche Stitch 25cm', price: 26500, categoria: 'peluches', image: require('../assets/stitch.jpg') },
  { id: 'mufasa', name: 'Peluche Mufasa Edición Limitada', price: 29900, categoria: 'peluches', image: require('../assets/mufasa.jpg') },
  { id: 'garfield', name: 'Peluche Garfield de 45 Cm', price: 34500, categoria: 'peluches', image: require('../assets/garfield.jpg') },
  { id: 'bobesponja', name: 'Peluche Bob Esponja Edición Limitada', price: 28000, categoria: 'peluches', image: require('../assets/bobesponja.jpg') },
  { id: 'mujermaravilla', name: 'Peluche Mujer Maravilla Edición Limitada', price: 31000, categoria: 'peluches', image: require('../assets/mujermaravilla.jpg') },
  { id: 'camioneta4x4', name: 'Camioneta 4x4 a Control Remoto con Luces Captor Speed Thunder Rojo', price: 19000, categoria: 'vehiculos', image: require('../assets/4x4rojo.jpg') },
  { id: 'spidermantruck', name: 'Camión Spiderman Edición Limitada', price: 21000, categoria: 'vehiculos', image: require('../assets/spidermantruck.jpg') },
  { id: 'spidermaninvolcable', name: 'Auto a Fricción Spiderman Color Rojo Negro', price: 10900, categoria: 'vehiculos', image: require('../assets/spidermaninvolcable.jpg') },
  { id: 'autovolveralfuturo', name: 'Auto Volver Al Futuro Back To The Future III Escala 1:24', price: 53900, categoria: 'vehiculos', image: require('../assets/autovolveralfuturo.jpg') },
];

export default function BusquedaGlobal() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.toLowerCase() || '';
  const resultados = productos.filter(p => p.name.toLowerCase().includes(query));
  const { addToCart } = require('../context/CartContext').useCart();
  const [selected, setSelected] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddClick = (producto) => {
    setSelected(producto);
    setQuantity(1);
  };
  const handleConfirm = () => {
    if (selected) {
      addToCart(selected, quantity);
      setSelected(null);
    }
  };
  const handleClose = () => setSelected(null);

  return (
  <div className="busqueda-global-container">
  <h2 className="busqueda-global-title" style={{fontSize: '2.5rem', textShadow: '2px 2px 0 #fff'}}>🎁 Resultados de búsqueda</h2>
      <p style={{fontSize: '1.2rem', color: '#f59e42', fontWeight: 700}}>Buscaste: <span style={{background: '#fff', borderRadius: 8, padding: '2px 10px'}}>{query}</span></p>
      {resultados.length === 0 ? (
        <p>No se encontraron juguetes.</p>
      ) : (
  <div className="row mt-4 g-4">
          {resultados.map(producto => (
            <div className="col-md-6 col-lg-4" key={producto.id}>
              <div className="busqueda-global-card h-100">
                {producto.image && (
                  <img 
                    src={producto.image} 
                    alt={producto.name} 
                    className="busqueda-global-img" 
                  />
                )}
                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="busqueda-global-title">{producto.name}</h5>
                  <div className="mb-2">
                    <span className="busqueda-global-price">${producto.price.toLocaleString()}</span>
                  </div>
                  <button className="busqueda-global-btn btn btn-lg" onClick={() => handleAddClick(producto)}>
                    🛒 Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal para elegir cantidad */}
      {selected && (
        <div className="modal fade show" style={{display: 'block', background: '#00000060'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="busqueda-global-modal-content modal-content">
              <div className="busqueda-global-modal-header modal-header">
                <h5 className="busqueda-global-modal-title modal-title">Agregar al carrito</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="busqueda-global-modal-body modal-body">
                <p style={{fontWeight: 900, fontSize: '1.2rem', color: '#f43f5e'}}>{selected.name}</p>
                <p style={{fontWeight: 700, color: '#f59e42'}}>Precio unitario: ${selected.price.toLocaleString()}</p>
                <div className="mb-3 d-flex flex-column align-items-center">
                  <label htmlFor="cantidad" className="busqueda-global-modal-label form-label">Cantidad:</label>
                  <input type="number" id="cantidad" className="busqueda-global-modal-input form-control" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)||1))} />
                </div>
                <p className="busqueda-global-modal-total fw-bold">Total: ${(selected.price * quantity).toLocaleString()}</p>
              </div>
              <div className="busqueda-global-modal-footer modal-footer">
                <button type="button" className="busqueda-global-modal-btn-cancel btn btn-lg" onClick={handleClose}>Cancelar</button>
                <button type="button" className="busqueda-global-modal-btn-add btn btn-lg" onClick={handleConfirm}>Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
