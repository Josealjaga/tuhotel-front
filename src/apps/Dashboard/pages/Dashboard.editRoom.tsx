import { FC, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '@Shared/Components/Card.tsx';
import Input from '@Shared/Components/Input';
import Button from '@Shared/Components/Button';
import { BACKEND } from '@Shared/Consts/Back';


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

type EditRoomProps = object;

const EditRoom: FC<EditRoomProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<Room>({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
 
    const fetchRooms = async () => {
      const response = await fetch(`${BACKEND}/rooms/${id}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        const room = data.data;
        setValue('photos', room.photos);
          setValue('codeName', room.codeName);
          setValue('description', room.description);
          setValue('pricePerNight', room.pricePerNight);
          setValue('capacity', room.capacity);
          setValue('bedsQuantity', room.bedsQuantity);
      } else {
        console.error('Error fetching rooms');
      }
    };

    fetchRooms();
  }, [id, setValue]);

  

  const onSubmit = async (data: Room) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);
      const token = sessionStorage.getItem('user_token');

      const response = await fetch(`${BACKEND}/admin/updateRooms/${id}`, { 
        method: 'PUT',
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
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}>
                Editar Habitación
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditRoom;
