import React from 'react';

interface RoundedBoxProps {
  route: string;
  borderColor: string;
  interiorColor: string;
  text: string;
  icon: string;
}

const RoundedBox: React.FC<RoundedBoxProps> = ({ borderColor, interiorColor, text, icon, route }) => {
  return (
    <a href= {route}
    className="w-1/3 rounded-md flex flex-col items-center justify-center border-2 h-48 px-20"
    style={{
      border: `2px solid ${borderColor}`,
      backgroundColor: interiorColor,
    }}>
        <span className="text-xl sm:text-2xl md:text-3xl">{icon}</span>
        <h2 className="text-black text-lg sm:text-xl md:text-2xl pt-4 underline whitespace-nowrap">{text}</h2>    
    </a>
  );
};

export default RoundedBox;
