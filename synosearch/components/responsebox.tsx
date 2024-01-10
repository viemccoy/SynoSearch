import React from 'react';

type ResponseBoxProps = {
  response: string | null;
};

const ResponseBox: React.FC<ResponseBoxProps> = ({ response }) => {
  return (
    <div className="w-full p-4 mt-4 bg-white border border-gray-200 rounded-md">
      <p className="text-black">{response}</p>
    </div>
  );
};

export default ResponseBox;