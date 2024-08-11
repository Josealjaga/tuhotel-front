import { BACKEND } from '@Shared/Consts/Back';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import { useNavigate } from 'react-router-dom';

interface Hotel {
  id: string;
  name: string;
  photo: string;
  description: string;
  country: string;
  city: string;
  address: string;
  ranking: number;
  bestPrice: number;
}

interface Room {
  id: string;
  photos: string;
  codeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedsQuantity: number;
}

const HotelDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del hotel de la URL
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Array<Room>>([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      const result = await fetch(`${BACKEND}/hotels/${id}`);
      const data = await result.json();
      setHotel(data.data); 
      setRooms(data.data.Rooms); 
    };

    fetchHotelDetails();
  },[id]);
  

  return (
    <div className="container mx-auto p-6">
      {hotel && (
        <>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={hotel.photo} alt={hotel.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
              <p className="text-gray-700 mb-4">{hotel.description}</p>
              <p className="text-gray-700 mb-4">Ubicado en: {hotel.country}, {hotel.city}, {hotel.address}</p>
              <p className="text-gray-700 mb-4">Ranking: {hotel.ranking}</p>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Habitaciones disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-4 text-center">{room.codeName}</h3>
                    <img src={room.photos} alt={room.codeName} className="w-full h-64 object-cover rounded-sm" />
                    <p className="text-gray-600">Precio: ${room.pricePerNight.toLocaleString('es', { style: 'currency', currency: 'COP' })}</p>
                    <p className="text-gray-600">Descripcion: {room.description}</p>
                    <p className="text-gray-600">Capacidad: {room.capacity} personas</p>
                    <p className="text-gray-600">Cantidad de camas: {room.bedsQuantity}</p>
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                      onClick={() => {
                        navigate(`/reservation/${room.id}`);
                        }}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HotelDetails;