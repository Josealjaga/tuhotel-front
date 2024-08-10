import { 
  Suspense,
  StrictMode, 
} from 'react'
import { createRoot, } from 'react-dom/client'

import './index.css';
import App from './App';

/**
 * 
 * Ciclo de vida en React
 * 
 */
function bootstrap(): void {
  const rootElement = document.getElementById('root');
  // ! Paso 1. Renderizado de los componentes o entry point
  createRoot(rootElement!)
    .render(
      <StrictMode>
        <Suspense fallback={<p>Loading...</p>}>
          <App />
        </Suspense>
      </StrictMode>
    );
}

bootstrap();