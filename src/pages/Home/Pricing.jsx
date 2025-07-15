
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
import { useTranslation } from "../../context/LanguageContext";
function Pricing() {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const isMobile = useMediaQuery(`(max-width: 991px)`);
    const navigate = useNavigate();
    const { t, lang } = useTranslation();

    const { data } = useHomeSubscription(); // بيانات الخطط من الـ API

    return (
        <>
            <Card style={{ zIndex: "10", backgroundColor: "transparent" }}>
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <h2 className={classes.Choose}>{t.Pricing}</h2>
                    <p style={{ color: "var(--color-P)" }}>
                        {t.JoinCompany} <br />
                        {t.listingsLead}
                    </p>

                    <Center style={{ marginTop: "30px" }}>
                        <Text fz={18} fw={600}
                        >{t.monthly}</Text>
                        <Switch
                            mr={20} ml={20}
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
                        <Text fz={18} fw={600} >{t.yearly}</Text>
                        <Text mr={20} ml={20} className={classes.off}>35% {t.discount}</Text>
                    </Center>
                </div>

                <Center>
                    <Grid gutter={32} style={{ width: "80%" }}>
                        {data?.data.map((plan) => (
                            <Grid.Col
                                style={{
                                    cursor: "pointer", // لتعطيل مؤشر اليد عند المرور
                                }}
                                onClick={() => {
                                    navigate("/register")
                                }}
                                key={plan.id} span={isMobile ? 12 : 4}>
                                <div
                                    className={classes.PricingGrid}
                                >
                                    <Group position="apart" mb={5}>
                                        <Text>{plan.name}</Text>
                                    </Group>
                                    <Text

                                        size="xl" weight={700}>
                                        {billingCycle === "monthly"
                                            ? `$ ${plan.pricing.monthly_price} / monthly`
                                            : `$ ${plan.pricing.yearly_price} / yearly`}
                                        <br />
                                        {billingCycle === "annually" && (
                                            <>
                                                {t.SavedMoney}: $ {plan.pricing.yearly_savings}
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
                                            // [lang === "en" ? "justifyContent" : "justifyContent"]: "start",
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
                                            <span style={{
                                                color: "green",
                                                [lang === "ar" ? "marginLeft" : "marginRight"]: "20px",
                                            }}>✔</span>
                                            <span>{t.LimitRealState}</span> {" : "}
                                            {plan.features.listings_limit}
                                        </li>
                                        <li style={{
                                            padding: "10px 0"
                                        }}
                                        >
                                            <span style={{
                                                color: "green",
                                                [lang === "ar" ? "marginLeft" : "marginRight"]: "20px",
                                            }}>✔</span>
                                            <span>{t.LimitEmployees}</span> {" : "}
                                            {plan.features.employees_limit}
                                        </li>
                                        <li style={{
                                            padding: "10px 0"
                                        }}
                                        >
                                            <span style={{ color: "green", [lang === "ar" ? "marginLeft" : "marginRight"]: "20px", }}>✔</span>
                                            <span>{t.LimitSupervisors}</span> {" : "}
                                            {plan.features.supervisors_limit}
                                        </li>
                                    </ul>
                                    <Button
                                        fullWidth
                                        onClick={() => {
                                            navigate("/register")
                                        }}
                                        style={{

                                            width: "200px",
                                            height: "50px",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            cursor: "pointer", // لتعطيل مؤشر اليد عند المرور
                                            pointerEvents: "none", // لإيقاف أي تفاعل مع الزر
                                        }}
                                    >
                                        {t.choose}
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