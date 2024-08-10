import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../public/logo1.png';
import usuario from '../../../../public/usuario.png';

type NavbarProps = object & React.ComponentPropsWithRef<'header'>;

const Navbar: FC<NavbarProps> = ({ ref }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(sessionStorage.getItem('user_token'));
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Verifica si el usuario es administrador

  const handleUserIconClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleOptionClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('user_token');
    sessionStorage.removeItem('isAdmin');
    setMenuOpen(false);
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <header 
      ref={ref} 
      className='z-10 w-full h-[--navbar-height] bg-white border-b border-b-gray-200 fixed rounded-b-xl'>
      <div className='w-full h-full flex items-center justify-between max-w-[1620px] mx-auto'>
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className='text-2xl font-primary font-bold'
        >
          <img src={logo} alt="Hotel Logo" className='h-[--navbar-height]' />
        </a>
        <div className='relative'>
          <img 
            src={usuario} 
            alt="usuario" 
            className='h-8 cursor-pointer' 
            onClick={handleUserIconClick} 
          />
          {menuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg'>
              {!isAuthenticated ? (
                <>
                  <div 
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer' 
                    onClick={() => handleOptionClick('/login')}
                  >
                    Iniciar sesión
                  </div>
                  <div 
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer' 
                    onClick={() => handleOptionClick('/signup')}
                  >
                    Registrarse
                  </div>
                </>
              ) : (
                <>
                  {isAdmin && ( // Mostrar "Administrar" solo si el usuario es administrador
                    <div 
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer' 
                      onClick={() => handleOptionClick('/dashboard')}
                    >
                      Administrar
                    </div>
                  )}
                  <div 
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer' 
                    onClick={() => handleOptionClick('/reservations/myreservations')}
                  >
                    Mis reservas
                  </div>
                  <div 
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer' 
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

