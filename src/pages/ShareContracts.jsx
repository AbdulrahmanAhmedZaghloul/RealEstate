import { useParams } from "react-router-dom";

function ShareContracts() {
  const { api } = useParams();

  return (
    <div>
      <h1>Shared Contract</h1>
      <p>API Value: {api}</p>
    </div>
  );
}

export default ShareContracts;