import { BACKEND } from '@Shared/Consts/Back';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Room {
  id: string;
  photos: string;
  codeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedsQuantity: number;
}
 type AdminRoomProps = object;
const AdminRooms: FC<AdminRoomProps> = () => {
  const [rooms, setRooms] = useState<Array<Room>>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch(`${BACKEND}/rooms/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data.data);
      } else {
        console.error('Error fetching rooms');
      }
    };

    fetchRooms();
  }, []);

  const handleDeleteRoom = async (id: string) => {
    const token = sessionStorage.getItem('user_token');
    const response = await fetch(`${BACKEND}/admin/deleteRooms/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setRooms(rooms.filter(room => room.id !== id));
    } else {
      console.error('Error deleting room');
    }
  };

  const handleCreateRoom = () => {
    navigate('/dashboard/rooms/create');
  };

  const handleEditRoom = () => {
    if (selectedRoom) {
      navigate(`/dashboard/rooms/edit/${selectedRoom.id}`);
    }
  };

  return (
    <div className="p-4 h-screen w-screen overflow-x-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Administrar Habitaciones</h2>
        <button 
          onClick={handleCreateRoom} 
          className="bg-blue-500 text-white py-2 px-4 rounded">
          Crear Habitación
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Foto URL</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Precio por noche</th>
              <th className="border px-4 py-2">Capacidad</th>
              <th className="border px-4 py-2">Cantidad de camas</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr 
                key={room.id} 
                className={`cursor-pointer ${selectedRoom?.id === room.id ? 'bg-gray-200' : ''}`}
                onClick={() => setSelectedRoom(room)}>
                <td className="border px-4 py-2">{room.id}</td>
                <td className="border px-4 py-2">{room.codeName}</td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center">
                    <img src={room.photos} alt={room.codeName} className="w-20 h-20 object-cover" />
                  </div>
                </td>
                <td className="border px-4 py-2">{room.description}</td>
                <td className="border px-4 py-2">{room.pricePerNight}</td>
                <td className="border px-4 py-2">{room.capacity}</td>
                <td className="border px-4 py-2">{room.bedsQuantity}</td>
                <td className="border px-4 py-2 flex justify-around">
                  <button 
                    onClick={() => handleDeleteRoom(room.id)} 
                    className="bg-red-500 text-white py-1 px-2 rounded">
                    Eliminar
                  </button>
                  <button 
                    onClick={handleEditRoom} 
                    className="bg-yellow-500 text-white py-1 px-2 rounded">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRooms;
