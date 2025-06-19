import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/config";
import { Loader, Center, Card, Text, Grid, GridCol, Title } from "@mantine/core";

export default function PublicContractView() {
  const { path } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      const decodedPath = decodeURIComponent(path);
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `https://sienna-woodpecker-844567.hostingersite.com/api/v1/contracts/${decodedPath}`
        );
        setContract(response.data.data);
      } catch (error) {
        console.error("Error fetching contract:", error);
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      fetchContract();
    }
  }, [path]);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!contract) {
    return (
      <Center h="100vh">
        <Text size="lg" color="red">No contract found.</Text>
      </Center>
    );
  }

  return (
    <Center p="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder w={800}>
        <Title order={3} mb="md">
          Contract: {contract.title}
        </Title>

        <Grid gutter="md">
          <GridCol span={6}>
            <Text><strong>Customer Name:</strong> {contract.customer_name}</Text>
            <Text><strong>Phone:</strong> {contract.customer_phone}</Text>
            <Text><strong>Price:</strong> {parseFloat(contract.price).toLocaleString()} ريال</Text>
            <Text><strong>Down Payment:</strong> {parseFloat(contract.down_payment).toLocaleString()} ريال</Text>
            <Text><strong>Payment Method:</strong> {contract.payment_method}</Text>
            <Text><strong>Status:</strong> {contract.status}</Text>
            <Text><strong>Contract Type:</strong> {contract.contract_type}</Text>
            <Text><strong>Document:</strong> 
              <a href={contract.document_url} target="_blank" rel="noopener noreferrer">
                View / Download
              </a>
            </Text>
          </GridCol>

          <GridCol span={6}>
            <Text><strong>Location:</strong> {contract.location}</Text>
            <Text><strong>Area:</strong> {contract.area} m²</Text>
            <Text><strong>Bedrooms:</strong> {contract.bedrooms}</Text>
            <Text><strong>Bathrooms:</strong> {contract.bathrooms}</Text>
            <Text><strong>Release Date:</strong> {new Date(contract.release_date).toLocaleDateString()}</Text>
            <Text><strong>Effective Date:</strong> {new Date(contract.effective_date).toLocaleDateString()}</Text>
            <Text><strong>Expiration Date:</strong> {new Date(contract.expiration_date).toLocaleDateString()}</Text>
          </GridCol>
        </Grid>

        <Text mt="md"><strong>Description:</strong> {contract.description}</Text>
      </Card>
    </Center>
  );
}
