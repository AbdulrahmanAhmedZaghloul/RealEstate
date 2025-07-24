
import { Card, Grid } from '@mantine/core';
import React from 'react';
import classes from "../../../styles/realEstates.module.css";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/LanguageContext';
import Rooms from '../../icons/rooms';
import Bathrooms from '../../icons/bathrooms';
import FloorsIcon from '../../icons/FloorsIcon';
import Area from '../../icons/area';

const MatchesSection = ({ matching_properties }) => {
      const propertiesArray = Object.values(matching_properties);
  const navigate = useNavigate();
      const { t} = useTranslation();

      return (
            <div>
                  <h2 className="text-xl font-bold mb-2">
                        Matches {propertiesArray.length}
                  </h2>
                  <Grid className={classes.sty} align="center" spacing="xl">
                        {propertiesArray.map(prop => (
                              <Grid.Col key={prop.id} span={{ base: 12, lg: 4, md: 6, sm: 6 }} style={{ cursor: 'pointer' }}>
                                    <Card 
                                          onClick={() =>
                                                navigate(`/dashboard/Properties/${prop.id}`)
                                          }
                                    className={classes.card}>
 
                                          <Card.Section radius="md">
                                                <img
                                                      src={prop.images[0]?.image_url || `${prop.images[0]?.image_path}`}
                                                      alt={prop.title}
                                                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                                />
                                                <p className={classes.listingfor}>
                                                      {prop.selling_status === 1 ? `${prop.listing_type} / sold` : prop.listing_type}
                                                </p>
                                          </Card.Section>
                                          <div style={{
                                                marginTop: "16px",
                                                display: "flex",
                                                flexWrap: "wrap",
                                          }}>
                                                <span className={classes.listingPrice}>
                                                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                                                                              
                                                      {parseFloat(prop.price)?.toLocaleString()}
                                                                                           </span>
                                                <span className={classes.downPaymentBadge}>
                                                      {prop.down_payment} % {t.DownPayment}
                                                </span>
                                          </div>
                                          <div style={{ marginTop: 8 }}>
                                                <p className={classes.listingTitle}>{prop.title}</p>
                                                <div className={classes.listingUtilities}>
                                                   
                                                      <div className={classes.listingUtility}>
                                                          
                                                            {prop.rooms > 0 && (
                                                                               <>
                                                                                     <div className={classes.utilityImage}>
                                                                                           <Rooms />
                                                                                     </div>
                                                                        {prop.rooms}
                                                                               </>
                                                                         )}
                                                  </div>                                              
                                                   <div className={classes.listingUtility}>
                                                          
                                                            {prop.bathrooms > 0 && (
                                                                               <>
                                                                                     <div className={classes.utilityImage}>
                                                                        <Bathrooms />
                                                                                     </div>
                                                                        {prop.bathrooms}
                                                                               </>
                                                                         )}
                                                  </div>                                              
                                                      <div className={classes.listingUtility}>

                                                            {prop.floors > 0 && (
                                                                  <>
                                                                        <div className={classes.utilityImage}>
                                                                              <FloorsIcon />
                                                                        </div>
                                                                        {prop.floors}
                                                                  </>
                                                            )}
                                                      </div>   
                                                      <div className={classes.listingUtility}>

                                                            {prop.area > 0 && (
                                                                  <>
                                                                        <div className={classes.utilityImage}>
                                                                              <Area />
                                                                        </div>
                                                                        {prop.area}
                                                                  </>
                                                            )}
                                                      </div>   
                                                </div>
 
                                                 
                                          

                                                <p>{prop.category.name} / {prop.subcategory.name}</p>
                                                <p>{prop.location}</p>
                                          </div>
                                    </Card>
                              </Grid.Col>
                        ))}
                  </Grid>
            </div>
      );
};

export default MatchesSection;
