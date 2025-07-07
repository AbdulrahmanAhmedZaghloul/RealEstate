import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/config";
import { Card, Center, Text, Grid, Loader, GridCol } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "../styles/contractDetails.module.css"; // استخدم نفس ملف CSS
import Area from "../components/icons/area";
import BathsIcon from "../components/icons/BathsIcon";
import BedsIcon from "../components/icons/BedsIcon";
import CategoryIcon from "../components/icons/CategoryIcon";
import iamge from "../assets/contract/contract.png";
import { useTranslation } from "../context/LanguageContext";

export default function PublicContractView() {
  const { path } = useParams();
  console.log(path);

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 991px)`);

  useEffect(() => {
    const fetchContract = async () => {
      const decodedPath = decodeURIComponent(path);
      console.log(decodedPath);

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `https://sienna-woodpecker-844567.hostingersite.com/api/v1/contracts/${decodedPath}`
        );
        console.log(response);

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


  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

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
        <Text size="lg" color="red">
          لا يوجد عقد
        </Text>
      </Center>
    );
  }

  return (


    <>
      <Card
        style={{
          padding: "20px",
          width: "90%",
          margin: "auto",
        }}
        shadow="sm"
        className={classes.card}
      >
        {/* Image Section */}
        <div className={classes.imageContainer}>
          <div className={classes.ImageContainerBig}>
            {/* <img
              src={`https://sienna-woodpecker-844567.hostingersite.com/api/v1/storage/${contract.real_estate?.images?.[0]?.url}`}
              alt={contract.title}
              className={classes.mainImage}
            /> */}
            <img src={iamge} alt=""
              className={classes.mainImage} />
          </div>
          <div className={classes.widthImageContainer}>
            {/* {contract.real_estate?.images?.slice(1, 3).map((img, index) => (
              <img
                key={index}
                src={`https://sienna-woodpecker-844567.hostingersite.com/api/v1/storage/${img.url}`}
                alt="Real Estate"
                className={classes.mainImage}
              />
            ))} */}
            <img src={iamge} alt="" className={classes.mainImage} />
            <img src={iamge} alt="" className={classes.mainImage} />
          </div>
        </div>

        {/* Details Section */}
        <div className={classes.details}>
          <Grid>
            <Grid.Col span={isMobile ? 12 : 8}>
              <Grid>
                <Grid.Col span={12}>
                  <div className={classes.text}>
                    <Text className={classes.price}>
                      ₣{parseFloat(contract.price).toLocaleString()}
                    </Text>
                    <Text className={classes.Down}>
                      {parseFloat(contract.down_payment).toLocaleString()}% {t.DownPayment}
                    </Text>
                  </div>
                  <h3 className={classes.title}>
                    {contract.real_estate.title}
                  </h3>
                  <div className={classes.flexLocation}>
                    <div className={classes.svgLocation}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                          stroke="var(--color-4)"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                          stroke="var(--color-4)"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <p className={classes.location}>
                        {contract.real_estate.location}
                      </p>
                    </div>
                  </div>
                  <Grid.Col span={12} className={classes.svgCol}>
                    {contract?.bedrooms > 0 && (
                      <span className={classes.svgSpan}>
                        <div>
                          <BedsIcon /> <span>{contract?.bedrooms} Beds</span>
                        </div>
                      </span>
                    )}
                    {contract?.bathrooms > 0 && (
                      <span className={classes.svgSpan}>
                        <div>
                          <BathsIcon /> <span>{contract?.bathrooms} Baths</span>
                        </div>
                      </span>
                    )}
                    <span className={classes.svgSpan}>
                      <div>
                        <Area /> <span>{contract?.area} sqm</span>
                      </div>
                    </span>
                    <span className={classes.svgSpan}>
                      <div>
                        <CategoryIcon />
                        <span>{contract?.real_estate?.category}</span>
                      </div>
                    </span>
                  </Grid.Col>
                  <div className={classes.description}>
                    <h4>{t.Description}</h4>
                    <p>{contract?.description}</p>
                  </div>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>

          {/* Contract Info */}
          <Grid>
            <Grid.Col
              span={isMobile ? 12 : 8}
              className={classes.ContractSection}
            >
              <h4>{t.Contract}</h4>
              <div className={classes.ContractImage}>
                <div>
                  <img src={iamge} alt="Contract" />
                </div>
                <div className={classes.ContractText}>

                </div>
              </div>
            </Grid.Col>
          </Grid>

          <h4>{t.ContractDescription}</h4>
          <p>{contract.description}</p>

          <Grid className={classes.ContractsInformation}>
            <GridCol
              span={isMobile ? 12 : 8}
              className={classes.InformationGrid}
            >
              <div className={classes.InformationButton}>
                <div>
                  <h3>{t.ContractsInformation}</h3>
                </div>
              </div>
              <Grid>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.Contracttype}</p>
                  <p className={classes.InformationSale}>
                    {contract.contract_type}
                  </p>
                </GridCol>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.Releasedate}</p>
                  <p className={classes.InformationSale}>
                    {new Date(contract.release_date).toLocaleDateString()}
                  </p>
                </GridCol>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.DownPayment}</p>
                  <p className={classes.InformationSale}>
                    {parseFloat(contract.down_payment).toLocaleString()}%
                  </p>
                </GridCol>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.Customername}</p>
                  <p className={classes.InformationSale}>
                    {contract.customer_name}
                  </p>
                </GridCol>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.Customerphone}</p>
                  <p className={classes.InformationSale}>
                    {contract.customer_phone}
                  </p>
                </GridCol>
                <GridCol span={4}>
                  <p className={classes.InformationType}>{t.Status}</p>
                  <p className={classes.InformationSale}>{contract.status}</p>
                </GridCol>
              </Grid>
            </GridCol>
          </Grid>

          {/* Location Map */}
          <Grid>
            <GridCol span={isMobile ? 12 : 10}>
              <h4>{t.Location}</h4>
              <div className={classes.LocationPrivado}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="var(--color-2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                    stroke="var(--color-2)"
                    strokeWidth="2"
                  />
                </svg>
                <span>{contract.real_estate.location}</span>
              </div>
              <iframe
                className={classes.locationMap}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  contract.real_estate.location
                )}&output=embed`}
                width="650"
                height="450"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </GridCol>
          </Grid>
        </div>
      </Card>

    </>

  );
}
