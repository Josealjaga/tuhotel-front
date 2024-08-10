import {
  FC,
  PropsWithChildren,
} from 'react';

type CardProps = object & PropsWithChildren & {
  title: string;
  photo?: string;
  city?: string;
  children?: string;
  price?: number;

};

const Card2: FC<CardProps> = ({
  title,
  photo,
  city,
  price, 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 rounded-lg shadow-md bg-white w-2/4 h-[120px] m-2">
      <div className=" w-full md:w-1/3">
        <img
          src={photo}
          alt={title}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-2 justify-between w-full md:w-2/3 p-4">
        <div className=''>
          <h2 className="text-xl font-bold">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">★★★★</span>
            <span className="text-gray-500">Hotel</span>
          </div>
          <p className="text-gray-600">{city}</p>
        </div>
        <div className="flex flex-col items-center ">
          <div className="text-gray-600">Desde</div>
          <div className="text-2xl font-bold">$ {(price?? 0).toLocaleString('es', { style: 'currency', currency: 'COP' })} </div>
          <div className="text-gray-600">por noche</div>

        </div>
      </div>

    </div>
  );
};

export default Card2;