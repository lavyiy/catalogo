import { Routes } from './routes';
import { useParams } from 'react-router-dom';

function App({ storeSlug }: { storeSlug: string }) {
  const { slug } = useParams<{ slug: string }>();

  // Usar slug de ruta o variable de environment
  const currentSlug = slug || storeSlug;

  return (
    <Routes storeSlug={currentSlug} />
  );
}

export default App;