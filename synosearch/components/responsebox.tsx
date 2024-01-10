import React from 'react';

type ResponseBoxProps = {
  response: string | null;
};

const ResponseBox: React.FC<ResponseBoxProps> = ({ response }) => {
  return (
    <div className="response-box">
      {response ? <p>{response}</p> : <p>No response yet...</p>}
    </div>
  );
};

export default ResponseBox;