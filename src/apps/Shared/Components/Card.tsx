import { 
  FC, 
  PropsWithChildren,
} from 'react';

type CardProps = object & PropsWithChildren & {
  title: string;
  
};

const Card: FC<CardProps> = ({
  title,
  children,
}) => {
  return (
    <article className='relative max-w-[520px] w-full min-h-[400px] flex flex-col border border-gray-400 rounded-xl bg-white shadow-md p-6 opacity-95'>
      <div className='flex flex-col items-center justify-center mb-8'>
        <h2 className='text-2xl font-bold'>
          {title}
        </h2>
      </div>
      <div className='flex flex-col gap-y-4'>
        {children}
      </div>
    </article>
  );
};

export default Card;
