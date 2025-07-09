
import {
    Card,
    Button,
    Group,
    Text,
    Center,
    Switch,
    Grid,
} from "@mantine/core";
import { useState } from "react";
import classes from "../../styles/Pricing.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useHomeSubscription } from "../../hooks/queries/Home/useHomeSubscription";
import { useNavigate } from "react-router-dom";
function Pricing() {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const isMobile = useMediaQuery(`(max-width: 991px)`);
    const navigate = useNavigate();

    const { data } = useHomeSubscription(); // بيانات الخطط من الـ API

    return (
        <>
            <Card style={{ zIndex: "10", backgroundColor: "transparent" }}>
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <h2 className={classes.Choose}>Pricing</h2>
                    <p>
                        Join as a Company or Marketer. Upgrade your plan to access branded <br />
                        listings, lead tracking tools, and full property management features.
                    </p>

                    <Center style={{ marginTop: "30px" }}>
                        <Text fz={18} fw={600} mr={20}>monthly</Text>
                        <Switch
                            checked={billingCycle === "annually"}
                            onChange={(event) =>
                                setBillingCycle(event.currentTarget.checked ? "annually" : "monthly")
                            }
                            size="xl"
                            styles={{
                                track: { backgroundColor: "#faf8f8" },
                                thumb: { backgroundColor: "#4E00B2" },
                            }}
                        />
                        <Text fz={18} fw={600} ml={20}>yearly</Text>
                        <span className={classes.off}>35% discount</span>
                    </Center>
                </div>

                <Center>
                    <Grid gutter={32} style={{ width: "80%" }}>
                        {data?.data.map((plan) => (
                            <Grid.Col key={plan.id} span={isMobile ? 12 : 4}>
                                <div
                                    className={classes.PricingGrid}
                                >
                                    <Group position="apart" mb={5}>
                                        <Text>{plan.name}</Text>
                                    </Group>
                                    <Text size="xl" weight={700}>
                                        {billingCycle === "monthly"
                                            ? `$ ${plan.pricing.monthly_price} / monthly`
                                            : `$ ${plan.pricing.yearly_price} / yearly`}
                                        <br />
                                        {billingCycle === "annually" && (
                                            <>
                                                I saved money: $ {plan.pricing.yearly_savings}
                                                <br />
                                            </>
                                        )}
                                    </Text>
                                    <ul
                                        style={{
                                            paddingLeft: "0",
                                            listStyle: "none",
                                            display: "flex",
                                            alignItems: "start",
                                            justifyContent: "start",
                                            flexDirection: "column",
                                            gap: "10px",

                                        }}
                                    >
                                        <li
                                            style={{
                                                padding: "10px 0"
                                            }}

                                        >
                                            <span style={{ color: "green", marginRight: "10px" }}>✔</span>
                                            <span>Limit RealState</span> {" : "}
                                            {plan.features.listings_limit}
                                        </li>
                                        <li style={{
                                            padding: "10px 0"
                                        }}
                                        >
                                            <span style={{ color: "green", marginRight: "10px" }}>✔</span>
                                            <span>Limit employees</span> {" : "}
                                            {plan.features.employees_limit}
                                        </li>
                                        <li style={{
                                            padding: "10px 0"
                                        }}
                                        >
                                            <span style={{ color: "green", marginRight: "10px" }}>✔</span>
                                            <span>Limit supervisors</span> {" : "}
                                            {plan.features.supervisors_limit}
                                        </li>
                                    </ul>
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            navigate("/register")
                                        }}
                                        style={{
                                            // backgroundColor: plan.name === "Pro Plan" ? "#fff" : "var(--color-1)",
                                            // color: plan.name === "Pro Plan" ? "var(--color-1)" : "#f1f1f1",
                                            width: "200px",
                                            height: "50px",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            cursor: "default", // لتعطيل مؤشر اليد عند المرور
                                            pointerEvents: "none", // لإيقاف أي تفاعل مع الزر
                                        }}
                                    >
                                        choose
                                    </Button>
                                </div>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Center>
            </Card>
        </>
    );
}

export default Pricing;