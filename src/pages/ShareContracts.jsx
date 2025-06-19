import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ShareContracts() {
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (encodedUrl) {
      const decodedUrl = atob(encodedUrl); // فك التشفير
      fetch(decodedUrl)
        .then((res) => res.json())
        .then((data) => {
          setContractData(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching contract", err);
          setLoading(false);
        });
    }
  }, [encodedUrl]);

  if (loading) return <div>Loading...</div>;
  if (!contractData)
    return <div>Invalid or expired link.</div>;

  return (
    <div>
      <h1>Shared Contract</h1>
      <p>Title: {contractData.title}</p>
      <p>Customer Name: {contractData.customer_name}</p>
    </div>
  );
}

export default ShareContracts;