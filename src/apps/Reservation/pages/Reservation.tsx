import { BACKEND } from '@Shared/Consts/Back';
import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Room {
  id: string;
  pricePerNight: number;
}

interface Reservation {
  date: Date;
  status: 'active' | 'inactive' | 'cancel';
  nightsQuantity: number;
  total: number;
  roomId: string;
}

const Reservation: FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [nightsQuantity, setNightsQuantity] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const token = sessionStorage.getItem('user_token');


  

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const result = await fetch(`${BACKEND}/rooms/${roomId}`);
      const data = await result.json();
      setRoom(data.data);
    };

    const fetchReservedDates = async () => {
      const result = await fetch(`${BACKEND}/reservations/${roomId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
      });
      const data = await result.json();
      setReservedDates(data.data.map((date: string) => new Date(date)));
    };

    fetchRoomDetails();
    fetchReservedDates();
  }, [roomId]);

  const calculateNights = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNightsQuantity(diffDays);
    if (room) {
      setTotal(diffDays * room.pricePerNight);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      calculateNights();
    }
  }, [startDate, endDate]);

  const handleReservation = async () => {

  if (!startDate || !endDate || nightsQuantity <= 0 || total <= 0) {
    alert("Please ensure all fields are correctly filled out.");
    return;
  }

  const reservation: Reservation = {
    date: new Date(startDate),
    status: 'active',
    nightsQuantity,
    total,
    roomId: roomId!,
  };

  try {
    const response = await fetch('http://localhost:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reservation),
      
      
    });
    console.log(reservation);
  
    if (response.ok) {
      alert('Reservation successful');
      navigate(`/`);
    } else {
      const errorData = await response.json();
      console.error('Error creating reservation:', errorData);
      alert(`Error creating reservation: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error occurred. Please try again.');
  }
};

  const isDateReserved = (date: string) => {
    const dateToCheck = new Date(date);
    return reservedDates.some(reservedDate => 
      dateToCheck.getTime() === reservedDate.getTime()
    );
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Reserva</h1>
      {room && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700">Fecha de inicio:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                if (isDateReserved(e.target.value)) {
                  alert('Esta fecha ya está reservada');
                  setStartDate('');
                } else {
                  setStartDate(e.target.value);
                }
              }}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700">Fecha de fin:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => {
                if (isDateReserved(e.target.value)) {
                  alert('Esta fecha ya está reservada');
                  setEndDate('');
                } else {
                  setEndDate(e.target.value);
                }
              }}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-700">Cantidad de noches: {nightsQuantity}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">Total: {total.toLocaleString('es', { style: 'currency', currency: 'COP' })}</p>
          </div>
          <button
            onClick={handleReservation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservation;

