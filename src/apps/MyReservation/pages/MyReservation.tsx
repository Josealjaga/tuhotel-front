import { BACKEND } from '@Shared/Consts/Back';
import { FC, useEffect, useState } from 'react';

interface Reservation {
  id: string;
  date: Date;
  status: string; // "active" or "inactive" or "cancel"
  nightsQuantity: number;
  total: number;
  roomId: string;
  userId: string;
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

const MyReservations: FC = () => {
  const [reservations, setReservations] = useState<Array<Reservation>>([]);
  const [activeOnly, setActiveOnly] = useState<boolean>(true); // true for active, false for inactive or cancel
  const [rooms, setRooms] = useState<Map<string, Room>>(new Map());

  useEffect(() => {
    const fetchReservations = async () => {
      const result = await fetch(`${BACKEND}/reservations/myreservations`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('user_token')}` 
        }
      });
      const data = await result.json();
      setReservations(data.data);

      // Fetch rooms information after getting reservations
      fetchRooms(data.data.map((reservation: Reservation) => reservation.roomId));
    };

    fetchReservations();
  }, []);

  const fetchRooms = async (roomIds: string[]) => {
    // Fetch all rooms in one request
    const result = await fetch(`${BACKEND}/rooms?ids=${roomIds.join(',')}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('user_token')}` 
      }
    });
    const data = await result.json();
    
    // Map room IDs to room data
    const roomMap = new Map<string, Room>();
    data.data.forEach((room: Room) => roomMap.set(room.id, room));
    setRooms(roomMap);
  };

  const handleCancelReservation = async (id: string) => {
    await fetch(`${BACKEND}/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('user_token')}` 
      }
    });
    setReservations(reservations.map(reservation =>
      reservation.id === id ? { ...reservation, status: 'cancel' } : reservation
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Reservaciones</h1>
        <button
          className={`px-4 py-2 rounded-md ${activeOnly ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => setActiveOnly(!activeOnly)}
        >
          {activeOnly ? 'Mostrar Inactivas' : 'Mostrar Activas'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations
          .filter(reservation => activeOnly ? reservation.status === 'active' : reservation.status === 'inactive' || reservation.status === 'cancel')
          .map(reservation => {
            const room = rooms.get(reservation.roomId);
            return (
              <div key={reservation.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">ID reserva: {reservation.id}</h3>
                  <p className="text-gray-600">Habitación: {room?.codeName || 'Cargando...'}</p>
                  <p className="text-gray-600">Check-in: {new Date(reservation.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Días: {reservation.nightsQuantity}</p>
                  <p className="text-gray-600">Total: {reservation.total.toLocaleString('es', { style: 'currency', currency: 'COP' })}</p>
                  {reservation.status === 'active' && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancelar Reservación
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyReservations;

