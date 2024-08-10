import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card2 from '@Shared/Components/Card2';
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
type HomeProps = object;

const Home: FC<HomeProps> = () => {
  const [hotels, setHotels] = useState<Array<Hotel>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredHotels, setFilteredHotels] = useState<Array<Hotel>>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    const getAllHotels = async () => {
      const result = await fetch(`${BACKEND}/hotels`, {
        method: 'GET',
      });

      const data = await result.json();
      const hotels = data?.data;
      return hotels;
    };

    getAllHotels()
      .then(setHotels)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const sortHotelsByPrice = (hotels: Array<Hotel>, order: 'asc' | 'desc') => {
    return [...hotels].sort((a, b) => {
      if (order === 'asc') {
        return a.bestPrice - b.bestPrice;
      } else {
        return b.bestPrice - a.bestPrice;
      }
    });
  };

  useEffect(() => {
    let filtered = hotels;

    if (cityFilter) {
      filtered = filtered.filter(hotel => hotel.city.toLowerCase() === cityFilter.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = sortHotelsByPrice(filtered, priceOrder);

    setFilteredHotels(filtered);
  }, [searchTerm, cityFilter, priceOrder, hotels]);

  const handleHotelDetails = (hotelId: string) => {
    navigate(`/hotelDetail/${hotelId}`);
  };

  return (
    <div className='flex flex-col justify-center p-4'>
      <div className='flex mb-4'>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border p-2 mr-2 w-1/4 h-[40px] rounded-xl"
        >
          <option value="">Filtrar por ciudad</option>
          {[...new Set(hotels.map(hotel => hotel.city))].map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar hoteles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mb-4 w-2/4 h-[40px] rounded-xl"
        />

        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value as 'asc' | 'desc')}
          className="border p-2 mb-4 w-1/4 h-[40px] ml-2 rounded-xl"
        >
          <option value="asc">Ordenar por precio: Menor a Mayor</option>
          <option value="desc">Ordenar por precio: Mayor a Menor</option>
        </select>

      </div>

      {loading && (
        <p>Estamos trayendo los hoteles</p>
      )}
      {!loading && filteredHotels && filteredHotels.length > 0 && (
        <ul className='w-full h-full'>
          {filteredHotels.map(hotel => (
            <div key={hotel.id}>
              <li className='flex justify-center'>
                <Card2
                  title={hotel.name}
                  photo={hotel.photo}
                  children={hotel.description}
                  city={hotel.city}
                  price={hotel.bestPrice}
                />
                <div className="w-[150px] h-16 flex flex-col-reverse">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-15 h-10 relative top-[50px] mr-2"
                    onClick={() => handleHotelDetails(hotel.id)}
                  >
                    Ver detalles
                  </button>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
