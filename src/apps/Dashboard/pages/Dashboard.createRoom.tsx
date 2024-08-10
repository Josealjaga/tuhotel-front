import { FC, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Card from '@Shared/Components/Card.tsx';
import Input from '@Shared/Components/Input';
import Button from '@Shared/Components/Button';
import { BACKEND } from '@Shared/Consts/Back';

interface Hotel {
  id: string;
  name: string;
}

interface Room {
  id: string;
  photos: string;
  codeName: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  bedsQuantity: number;
  hotelId: string;
}

type CreateRoomProps = object;

const CreateRoom: FC<CreateRoomProps> = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  const [hotels, setHotels] = useState<Array<Hotel>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchHotels = async () => {
      const response = await fetch(`${BACKEND}/hotels`);
      if (response.ok) {
        const data = await response.json();
        setHotels(data.data);
      } else {
        console.error('Error fetching hotels');
      }
    };

    fetchHotels();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<Room>({
    defaultValues: {
      photos: '',
      codeName: '',
      description: '',
      pricePerNight: 0,
      capacity: 0,
      bedsQuantity: 0,
      hotelId: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: Room) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);
      const token = sessionStorage.getItem('user_token');

      const response = await fetch(`${BACKEND}/admin/rooms`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      const result = await response.json();
      if ('success' in result && !result.success) {
        const { message } = result;

        if (snackbarRef.current) 
          closeSnackbar(snackbarRef.current);

        snackbarRef.current = enqueueSnackbar(message ? message : 'Hubo un error en el servidor. Reintente', {
          variant: 'error',
        });
        return;
      }

      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar('Habitación creada exitosamente');
      navigate('/dashboard/rooms');
    } catch (err) {
      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar('Ocurrió un error inesperado', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='relative h-screen w-full overflow-hidden'>
      <div className='h-full w-full max-w-[1620px] mx-auto'>
        <div className='h-full w-full flex items-center'>
          <div className='grow'></div>
          <div className='grow h-full flex flex-col items-center justify-center p-6'>
            <Card title='Crear Habitación'>
              <Input
                name='photos'
                register={register('photos')}
                label='URL de la foto'
                placeholder='https://example.com/photo.jpg'/>
              <Input
                name='codeName'
                register={register('codeName')}
                label='Nombre de la habitación'
                placeholder='Ej. Habitación Premium'/>
              <Input
                name='description'
                register={register('description')}
                label='Descripción'
                placeholder='Descripción de la habitación'/>
              <Input
                name='pricePerNight'
                register={register('pricePerNight', { valueAsNumber: true })}
                type='number'
                label='Precio por noche'
                placeholder='Ej. $500.000 COP'/>
              <Input
                name='capacity'
                register={register('capacity', { valueAsNumber: true })}
                type='number'
                label='Capacidad'
                placeholder='Ej. 2 Personas'/>
              <Input
                name='bedsQuantity'
                register={register('bedsQuantity', { valueAsNumber: true })}
                type='number'
                label='Cantidad de camas'
                placeholder='Ej. 1 cama'/>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="hotelId" className={`relative flex flex-col px-6 py-3 gap-y-1 rounded-lg border-2 bg-white ${onfocus ? 'border-blue-700' : 'border-gray-400'}`}>
                <span className={`text-sm font-bold leading-[14px] ${onfocus ? 'text-blue-700' : 'text-gray-700'}`}>
                Hotel
                </span>
                <select
                  id="hotelId"
                  {...register('hotelId')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona un hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
                </label>
              </div>
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}>
                Crear Habitación
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateRoom;
