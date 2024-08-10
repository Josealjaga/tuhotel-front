# TuHotel - Frontend

Este es el frontend de la aplicación TuHotel, una plataforma para gestionar reservas de hoteles, incluyendo la administración de hoteles y habitaciones. Esta aplicación está desarrollada en React y utiliza varias bibliotecas para mejorar la experiencia del usuario.

## Características

- **Listado de hoteles**: Visualiza todos los hoteles disponibles.
- **Detalles del hotel**: Consulta la información detallada de cada hotel.
- **Reservaciones**: Permite a los usuarios realizar reservaciones de habitaciones.
- **Administración de hoteles y habitaciones**: Los usuarios con rol de administrador pueden gestionar los hoteles y las habitaciones.
- **Autenticación**: Sistema de registro e inicio de sesión de usuarios.
  
## Tecnologías utilizadas

- **React**: Biblioteca principal para construir la interfaz de usuario.
- **React Router**: Manejo de rutas dentro de la aplicación.
- **Tailwind CSS**: Estilos de la aplicación.
- **React Hook Form**: Manejo de formularios y validación.
- **Notistack**: Notificaciones para la experiencia del usuario.
- **Fetch API**: Para realizar peticiones HTTP a la API.

## Configuración del entorno

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Josealjaga/tuhotel-front.git
   ```

2. Instala las dependencias:

   ```bash
   cd tuhotel-front
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

   ```plaintext
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm start
   ```

   La aplicación se abrirá en `http://localhost:3000`.

## Scripts disponibles

- **`npm start`**: Inicia la aplicación en modo de desarrollo.
- **`npm run build`**: Construye la aplicación para producción en la carpeta `build`.
- **`npm test`**: Ejecuta las pruebas.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
