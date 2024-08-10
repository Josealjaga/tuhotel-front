import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import hotelIcon from '../../../../public/hotel.png';  // Asegúrate de tener íconos representativos
import roomIcon from '../../../../public/room.png';

type AdminDashboardProps = object;

const AdminDashboard: FC<AdminDashboardProps> = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        <div 
          className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out"
          onClick={() => handleNavigation('/dashboard/hotels')}
        >
          <img src={hotelIcon} alt="Administrar Hoteles" className="w-16 h-16 mb-4" />
          <h2 className="text-xl font-semibold">Administrar Hoteles</h2>
        </div>
        
        <div 
          className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out"
          onClick={() => handleNavigation('/dashboard/rooms')}
        >
          <img src={roomIcon} alt="Administrar Habitaciones" className="w-16 h-16 mb-4" />
          <h2 className="text-xl font-semibold">Administrar Habitaciones</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;