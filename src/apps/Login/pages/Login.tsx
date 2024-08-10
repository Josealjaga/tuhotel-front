import { 
  FC, 
  useRef,
  useState, 
} from 'react';
import { useSnackbar, } from 'notistack';
import { useForm, } from 'react-hook-form';
import { useNavigate, } from 'react-router-dom';

import Card from '@Shared/Components/Card';
import Input from '@Shared/Components/Input';
import Button from '@Shared/Components/Button';
import { BACKEND } from '@Shared/Consts/Back';

type LoginProps = object;

const Login: FC<LoginProps> = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);

  const {
    closeSnackbar,
    enqueueSnackbar,
  } = useSnackbar();

  const [loading, setLoading,] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, },
  } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: { email: string; password: string; }) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);

      const response = await fetch(`${BACKEND}/auth/login`, {
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

        snackbarRef.current = enqueueSnackbar(message ? message : 'Hubo un error en el servidor. Reintente', {
          variant: 'error',
        });
        return;
      }

      const { token, isAdmin } = result.data;

      window.sessionStorage.setItem('user_token', token);
      window.sessionStorage.setItem('isAdmin', isAdmin);

      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar('El usuario ha iniciado sesion');
      navigate('/');
    } catch (err) {
      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current)

      snackbarRef.current = enqueueSnackbar('Ocurrio un error inesperado', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden bg-[url("https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-cover bg-center'>
      <div className='h-full w-full max-w-[1620px] mx-auto'>
        <div className='h-full w-full flex items-center'>
          <div className='grow h-[150px] flex flex-col items-center justify-center p-6'>
            <Card
              title='Iniciar sesion'>
              <Input
                name='email'
                register={register('email')}
                type="email"
                label='Correo electronico'
                placeholder='example@mail.com' />
              <Input
                name='password'
                register={register('password')}
                type='password'
                label='Contraseña'
                placeholder='- - - - - - - -' />
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}>
                Enviar
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;