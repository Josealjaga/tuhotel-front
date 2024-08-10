import { BACKEND } from '@Shared/Consts/Back';
import { FC,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Hotel {
  id: string;
  name: string;
  description: string;
  photo: string;
  country: string;
  city: string;
  address: string;
  ranking: number;
  bestPrice: number;
}

type AdminHotelProps = object;
const AdminHotels: FC<AdminHotelProps> = () => {
  const [hotels, setHotels] = useState<Array<Hotel>>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch(`${BACKEND}/hotels/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data.data);
      } else {
        console.error('Error fetching hotels');
      }
    };

    fetchHotels();
  }, []);

  const handleDeleteHotel = async (id: string) => {
    const token = sessionStorage.getItem('user_token');
    const response = await fetch(`${BACKEND}/admin/hotels/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setHotels(hotels.filter(hotel => hotel.id !== id));
    } else {
      console.error('Error deleting hotel');
    }
  };

  const handleCreateHotel = () => {
    navigate('/dashboard/hotels/create');
  };

  const handleEditHotel = () => {
    if (selectedHotel) {
      navigate(`/dashboard/hotels/edit/${selectedHotel.id}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Administrar Hoteles</h2>
        <button 
          onClick={handleCreateHotel} 
          className="bg-blue-500 text-white py-2 px-4 rounded">
          Crear Hotel
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Foto URL</th>
            <th className="border px-4 py-2">País</th>
            <th className="border px-4 py-2">Ciudad</th>
            <th className="border px-4 py-2">Dirección</th>
            <th className="border px-4 py-2">Ranking</th>
            <th className="border px-4 py-2">Mejor precio</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr 
              key={hotel.id} 
              className={`cursor-pointer ${selectedHotel?.id === hotel.id ? 'bg-gray-200' : ''}`}
              onClick={() => setSelectedHotel(hotel)}>
              <td className="border px-4 py-2">{hotel.id}</td>
              <td className="border px-4 py-2">{hotel.name}</td>
              <td className="border px-4 py-2">{hotel.description}</td>
              <td className="border px-4 py-2">{hotel.photo}
                <div className="flex justify-center items-center">
                  <img src={hotel.photo} alt={hotel.name} className="w-20 h-20 object-cover" />
                </div>
              </td>
              <td className="border px-4 py-2">{hotel.country}</td>
              <td className="border px-4 py-2">{hotel.city}</td>
              <td className="border px-4 py-2">{hotel.address}</td>
              <td className="border px-4 py-2">{hotel.ranking}</td>
              <td className="border px-4 py-2">{hotel.bestPrice}</td>
              <td className="border px-4 py-2 flex justify-around">
                <button 
                  onClick={() => handleDeleteHotel(hotel.id)} 
                  className="bg-red-500 text-white py-1 px-2 rounded">
                  Eliminar
                </button>
                <button 
                  onClick={handleEditHotel} 
                  className="bg-yellow-500 text-white py-1 px-2 rounded">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHotels;

