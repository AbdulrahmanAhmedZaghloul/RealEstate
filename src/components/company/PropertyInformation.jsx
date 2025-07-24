// PropertyInformation.jsx
import { Grid, Text } from "@mantine/core";
import CategoryIcon from "../icons/CategoryIcon";
import Category from "../icons/Category";
import BedsIcon from "../icons/BedsIcon";
import BathsIcon from "../icons/BathsIcon";
import Area from "../icons/area";
import FloorsIcon from "../icons/FloorsIcon";
import CalendarIcon from "../icons/CalendarIcon";
import Purpose from "../icons/Purpose";
// import { CategoryIcon, BedsIcon, BathsIcon, Area, FloorsIcon } from "../icons"; // Assuming you have these icons

const PropertyInformation = ({ property }) => {
      return (
            <Grid gutter={20} mt={5} pt={5}  >
                  {/* Row 1: Category and Subcategory */}
                  <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center",
                              // gap: "10px"
                        }}>
                              <Category />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >

                                    Category
                              </span>


                        </Text>
                        <Text size="sm">{property.category?.name || "-"}</Text>
                  </Grid.Col>
                  <Grid.Col span={6} style={{
                        display: "flex",
                        gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}>
                              <CategoryIcon  />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                     paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Subcategory
                              </span>
                        </Text>
                        <Text size="sm">{property.subcategory?.name || "-"}</Text>
                  </Grid.Col>

                  {/* Row 2: Bedrooms and Bathrooms */}
                  <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",

                        gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }} >
                              <BedsIcon />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Bedrooms
                              </span>
                        </Text>
                        <Text size="sm">{property.rooms || "-"}</Text>
                  </Grid.Col>
                  <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",
                        // gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}> 
                              <BathsIcon />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Bathrooms
                              </span>
                        </Text>
                        <Text size="sm">{property.bathrooms || "-"}</Text>
                  </Grid.Col>
                  <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",
                        // gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}> 
                              <Area />

                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Area
                              </span>
                        </Text>
                        <Text size="sm">{property.area || "-"}</Text>
                  </Grid.Col>

                  {/* Row 3: Area and Floors */}
                  {/* <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",

                        // gap: "10px"
                  }}>
                        <Text size="sm" weight={500} tyle={{
                              display: "flex",
                              alignItems: "center", 
                        }}>
                              <Area />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "5px",
                                    paddingLeft: "5px"
                              }} >
                                    Area
                              </span>
                        </Text>
                        <Text size="sm">{`${property.area || "-"} `} sq.m</Text>
                  </Grid.Col> */}


                  <Grid.Col span={6}
                        style={{
                              display: "flex",
                              alignItems: "center",
                              // gap: "10px"
                        }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}>
                              <FloorsIcon />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    floors
                              </span>
                        </Text>
                        <Text size="sm">{property.floors || "-"}</Text>
                  </Grid.Col>

                  {/* Row 4: Purpose and Added From */}
                  <Grid.Col span={6} style={{
                        display: "flex",
                        alignItems: "center",
                        // gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}>
                              <Purpose />
                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Purpose
                              </span>
                        </Text>
                        <Text size="sm">{property.listing_type || "-"}</Text>
                  </Grid.Col>
                  <Grid.Col span={6} style={{
                        display: "flex",
                        // gap: "10px"
                  }}>
                        <Text size="sm" weight={500} style={{
                              display: "flex",
                              alignItems: "center", 
                        }}>
                              <CalendarIcon />

                              <span style={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingRight: "10px",
                                    paddingLeft: "10px"
                              }} >
                                    Bathrooms
                              </span>
                        </Text>
                        <Text size="sm">
                              {property.created_at ? calculateTimeAgo(property.created_at) : "-"}
                        </Text>
                  </Grid.Col>
            </Grid>
      );
};

// Helper function to calculate time ago
const calculateTimeAgo = (createdAt) => {
      const now = new Date();
      const createdDate = new Date(createdAt);
      const diffInMilliseconds = now - createdDate;

      if (diffInMilliseconds < 60 * 1000) {
            return "Just now";
      }

      const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
      if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      }

      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      if (hours < 24) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      }

      const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      if (days < 7) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
      }

      const weeks = Math.floor(days / 7);
      if (weeks < 4) {
            return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      }

      const months = Math.floor(days / 30);
      if (months < 12) {
            return `${months} month${months > 1 ? "s" : ""} ago`;
      }

      const years = Math.floor(days / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
};

export default PropertyInformation;