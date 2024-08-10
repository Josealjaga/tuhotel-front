import { FC, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Card from '@Shared/Components/Card.tsx';
import Input from '@Shared/Components/Input';
import Button from '@Shared/Components/Button';
import { BACKEND } from '@Shared/Consts/Back';

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

type EditHotelProps = object;

const EditHotel: FC<EditHotelProps> = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del hotel desde la URL
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, setValue, formState: { isValid } } = useForm<Hotel>({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`${BACKEND}/hotels/${id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          const hotel = data.data;

          // Prellenar el formulario con la información del hotel
          setValue('name', hotel.name);
          setValue('description', hotel.description);
          setValue('photo', hotel.photo);
          setValue('country', hotel.country);
          setValue('city', hotel.city);
          setValue('address', hotel.address);
          setValue('ranking', hotel.ranking);
          setValue('bestPrice', hotel.bestPrice);
        } else {
          console.error('Error fetching hotel details');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchHotel();
  }, [id, setValue]);

  const onSubmit = async (data: Hotel) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);
      const token = sessionStorage.getItem('user_token');

      const response = await fetch(`${BACKEND}/admin/hotels/${id}`, {
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

      snackbarRef.current = enqueueSnackbar('Hotel actualizado exitosamente');
      navigate('/dashboard/hotels');
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
            <Card title='Editar Hotel'>
              <Input
                name='name'
                register={register('name')}
                label='Nombre del hotel'
                placeholder='Ej. Hotel Luna'/>
              <Input
                name='description'
                register={register('description')}
                label='Descripción'
                placeholder='Descripción del hotel'/>
              <Input
                name='photo'
                register={register('photo')}
                label='URL de la foto'
                placeholder='https://example.com/photo.jpg'/>
              <Input
                name='country'
                register={register('country')}
                label='País'
                placeholder='Ej. México'/>
              <Input
                name='city'
                register={register('city')}
                label='Ciudad'
                placeholder='Ej. Cancún'/>
              <Input
                name='address'
                register={register('address')}
                label='Dirección'
                placeholder='Calle, Número, Colonia'/>
              <Input
                name='ranking'
                register={register('ranking', { valueAsNumber: true })}
                type='number'
                label='Ranking'
                placeholder='Ej. 4.5'/>
              <Input
                name='bestPrice'
                register={register('bestPrice', { valueAsNumber: true })}
                type='number'
                label='Mejor Precio'
                placeholder='Ej. 1500'/>
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}>
                Guardar Cambios
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditHotel;
