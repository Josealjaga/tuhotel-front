import { 
  FC, 
  useRef, 
  useState, 
} from 'react';
import { useSnackbar, } from 'notistack';
import { useForm, } from 'react-hook-form';
import { useNavigate, } from 'react-router-dom';

import Card from '@Shared/Components/Card.tsx';
import Input from '@Shared/Components/Input';
import Button from '@Shared/Components/Button';

import { User } from '@contexts/shared/domain/models/User';

type SignupProps = object;

const Signup: FC<SignupProps> = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  
  const {
    closeSnackbar,
    enqueueSnackbar,
  } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { isValid, },
  } = useForm<Pick<User, 'email' | 'name' | 'password' | 'phoneNumber' | 'address'>>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      phoneNumber: '',
      address: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  
  const [loading, setLoading,] = useState<boolean>(false);

  const onSubmit = async (data: Pick<User, 'name' | 'email' | 'password' | 'phoneNumber' | 'address'>) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
  
      const result = await response.json();
      if ('success' in result && !result.success) {
        const { message, } = result;

        if (snackbarRef.current) 
          closeSnackbar(snackbarRef.current);

        snackbarRef.current = enqueueSnackbar(message ? message : 'Hubo en el servidor. Reintente', {
          variant: 'error',
        });
        return;
      }

      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar('El usuario se ha registrado');
      navigate('/login');
    } catch (err) {
      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current)

      snackbarRef.current = enqueueSnackbar('Ocurrio un error inesperado', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='relative h-screen w-full overflow-hidden bg-[url("https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover bg-center'>
  <div className='h-full w-full max-w-[1620px] mx-auto'>
    <div className='flex h-full items-center justify-center'>
      <Card title='Registrese'>
        <Input
          name='name'
          register={register('name')}
          label='Nombre completo'
          placeholder='Ej. Pepe'/>
        <Input
          name='email'
          register={register('email')}
          type="email"
          label='Correo electronico'
          placeholder='example@mail.com'/>
        <Input
          name='password'
          register={register('password')}
          type='password'
          label='Contraseña'
          placeholder='- - - - - - - -'/>
        <Input
          name='phoneNumber'
          register={register('phoneNumber')}
          type='text'
          label='Numero de telefono'
          placeholder='1234567890'/>
        <Input
          name='address'
          register={register('address')}
          type='text'
          label='Direccion'
          placeholder='Ciudad, estado, barrio, calle'/>
        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || loading}>
          Registrarme
        </Button>
      </Card>
    </div>
  </div>
</section>
  );
};

export default Signup;


