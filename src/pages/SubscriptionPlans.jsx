// pages/SubscriptionPlans.js
import {
  Card,
  Button,
  Group,
  Text,
  Center,
  Switch,
  Modal,
  Grid,
} from "@mantine/core";
import { useState, useEffect } from "react";
import axiosInstance from "../api/config";
import { useAuth } from "../context/authContext";
import classes from "../styles/SubscriptionPlans.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useCurrentSubscription } from "../hooks/queries/useCurrentSubscription";
import { useMyCurrentSubscription } from "../hooks/queries/useMyCurrentSubscription";
import { notifications } from "@mantine/notifications";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import { useTranslation } from "../context/LanguageContext";

function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { t } = useTranslation();
  const { user, isSubscribed } = useAuth();
  const [modalOpened, setModalOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const role = sessionStorage.getItem("role") || localStorage.getItem("role");

  const { data: plansData } = useCurrentSubscription();
  const {
    data: currentSub,
    isLoading: loadingSub,
    plan_id,
  } = useMyCurrentSubscription();
  console.log(currentSub);
  console.log(plan_id);

  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // جلب حالة الاشتراك
  useEffect(() => {
    const check = async () => {
      if (user?.token) {
        const result = await isSubscribed();
        setIsUserSubscribed(result);
      } else {
        setIsUserSubscribed(false);
      }
      setLoading(false);
    };
    check();
  }, [user, isSubscribed]);
 
  const currentPlanId = currentSub?.plan_id; // مثلًا: "3"

  const successUrl =
    role === "marketer"
      ? "https://real-estate-one-lake.vercel.app/#/dashboard-Marketer"
      : "https://real-estate-one-lake.vercel.app/#/dashboard";

  const handleSubscribe = async (planId) => {
    try {
      const response = await axiosInstance.post(
        "subscriptions/checkout",
        {
          plan_id: planId,
          billing_period: billingCycle === "monthly" ? "monthly" : "yearly",
          success_url: successUrl,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.data.success && response.data.data?.checkout_url) {
        window.location.href = response.data.data.checkout_url;
      }
    } catch (error) {
      console.error("Error in checkout:", error);
      notifications.show({
        title: t.Error,
        message: error.response?.data?.message || t.FailedToFetchEmployees,
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={t.AutoRenewal}
        centered
        className={classes.zIndex}
      >
        <Text>{t.ConfirmAutoRenewal}</Text>
        <Group position="center" mt="md">
          <Button color="green">{t.Yes}</Button>
          <Button color="red" onClick={() => setModalOpened(false)}>
            {t.No}
          </Button>
        </Group>
      </Modal>

      <HeaderMegaMenu />

      <Card style={{ zIndex: "10", backgroundColor: "transparent" }}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text fz={50} className={classes.Choose}>
            {t.ChooseYourPlan}
          </Text>
          <Center style={{ marginTop: "30px" }}>
            <Text fz={18} fw={600} mr={20}>
              {t.Monthly}
            </Text>
            <Switch
              mr={20}
              ml={20}
              checked={billingCycle === "annually"}
              onChange={(event) =>
                setBillingCycle(
                  event.currentTarget.checked ? "annually" : "monthly"
                )
              }
              size="xl"
              styles={{
                track: { backgroundColor: "#faf8f8" },
                thumb: { backgroundColor: "#4E00B2" },
              }}
            />
            <Text fz={18} fw={600} ml={20}>
              {t.Yearly}
            </Text>
            <span className={classes.off}> {t.Discount35} </span>
          </Center>
        </div>

        <Center>
          <Grid gutter={32} style={{ width: "80%" }}>
            {plansData?.data?.map((plan) => (
              <Grid.Col key={plan.id} span={isMobile ? 12 : 4}>
                <div
                  style={{
                    backgroundColor:
                      plan.name === "Pro Plan"
                        ? "var(--color-1)"
                        : "transparent",
                    padding: "30px",
                    borderRadius: "10px",
                    width: "320px",
                    border:
                      plan.name === "Pro Plan"
                        ? "var(--color-5)"
                        : "1px solid rgb(191, 190, 190)",
                  }}
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
                      justifyContent: "start",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <li>
                      <span style={{ color: "green", margin: "0px 10px" }}>
                        ✔
                      </span>
                      <span>{t.LimitRealState}</span> {" : "}{" "}
                      {plan.features.listings_limit}
                    </li>
                    <li>
                      <span style={{ color: "green", margin: "0px 10px" }}>
                        ✔
                      </span>
                      <span>{t.LimitEmployees}</span> {" : "}{" "}
                      {plan.features.employees_limit}
                    </li>
                    <li>
                      <span style={{ color: "green", margin: "0px 10px" }}>
                        ✔
                      </span>
                      <span>{t.LimitSupervisors}</span> {" : "}{" "}
                      {plan.features.supervisors_limit}
                    </li>
                  </ul>
                  <Button
                    fullWidth
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={currentPlanId === plan.id}
                    style={{
                      backgroundColor:
                        plan.name === "Pro Plan" ? "#fff" : "var(--color-1)",
                      color:
                        plan.name === "Pro Plan" ? "var(--color-1)" : "#f1f1f1",
                      width: "200px",
                      height: "50px",
                      margin: "auto",
                      borderRadius: "10px",
                      opacity: currentPlanId === plan.id ? 0.6 : 1,
                    }}
                  > 

                    {loading || loadingSub
                      ? t.Loading
                      : currentSub.plan_id == plan.id
                      ? t.CurrentPlan
                      : isUserSubscribed
                      ? t.Update
                      : t.Choose}
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

export default SubscriptionPlans;

// import {
//   Card,
//   Button,
//   Group,
//   Text,
//   Center,
//   Switch,
//   Modal,
//   Grid,
//   GridCol,
// } from "@mantine/core";
// import { useEffect, useState } from "react";
// import axiosInstance from "../api/config";
// import { useAuth } from "../context/authContext";
// import logo from "../assets/header/logo-43.png";
// import positionleft from "../assets/palne/positionleft.jpg";
// import positionright from "../assets/palne/WhatsApp Image 2025-04-15 at 3.52.40 AM.jpeg";
// import classes from "../styles/SubscriptionPlans.module.css";
// import { useMediaQuery } from "@mantine/hooks";
// import { useCurrentSubscription } from "../hooks/queries/useCurrentSubscription";
// import { notifications } from "@mantine/notifications";
// import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
// import { useTranslation } from "../context/LanguageContext";

// function SubscriptionPlans() {
//   const [billingCycle, setBillingCycle] = useState("monthly");
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [modalOpened, setModalOpened] = useState(false);
//   const isMobile = useMediaQuery(`(max-width: 991px)`);
//   const role = sessionStorage.getItem("role") || localStorage.getItem("role");

//   if (role) {
//     console.log("Role found:", role);
//   } else {
//     console.log("No role found in session or local storage.");
//   }
//   let successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard";
//   // let successUrl = "http://localhost:5173/#/dashboard";

//   if (role === "marketer") {
//     successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard-Marketer"
//     // successUrl = "http://localhost:5173/#/dashboard-Marketer"
//   }
//   const {
//     data,
//   } = useCurrentSubscription();

//   const handleSubscribe = async (planId) => {
//     try {
//       const response = await axiosInstance.post("subscriptions/checkout",
//         {
//           plan_id: planId,
//           billing_period: billingCycle === "monthly" ? "monthly" : "yearly",
//           success_url: successUrl,
//         },
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });

//       // التأكد من وجود checkout_url
//       if (response.data.success && response.data.data?.checkout_url) {
//         window.location.href = response.data.data.checkout_url; // إعادة توجيه المستخدم إلى صفحة Stripe
//       }
//     } catch (error) {
//       console.error("Error in checkout:", error);
//       notifications.show({
//         title: t.Error,
//         message: error.response.message || t.FailedToFetchEmployees,
//         color: "red",
//       });
//     }
//   };

//   return (
//     <>
//       {/* مودال التأكيد */}
//       <Modal
//         opened={modalOpened}
//         onClose={() => setModalOpened(false)}
//         title={t.AutoRenewal}
//         centered
//         className={classes.zIndex}
//       >
//         <Text>{t.ConfirmAutoRenewal}</Text>
//         <Group position="center" mt="md">
//           <Button color="green">{t.Yes}</Button>
//           <Button color="red" onClick={() => setModalOpened(false)}>
//             {t.No}
//           </Button>
//         </Group>
//       </Modal>

//       {/* صورة الجانبين */}
//       {/* <div className={classes.positionright}>
//         <img src={positionright} alt="" />
//       </div>
//       <div className={classes.positionleft}>
//         <img src={positionleft} alt="" />
//       </div> */}

//       {/* الهيدر */}

//       <HeaderMegaMenu />

//       <Card style={{ zIndex: "10", backgroundColor: "transparent" }}>
//         <div style={{ padding: "20px", textAlign: "center" }}>
//           <Text fz={50} className={classes.Choose}>
//             {t.ChooseYourPlan}
//           </Text>
//           <Center style={{ marginTop: "30px" }}>
//             <Text fz={18} fw={600} mr={20}>  {t.Monthly}</Text>
//             <Switch
//             mr={20}
//             ml={20}
//               checked={billingCycle === "annually"}
//               onChange={(event) =>
//                 setBillingCycle(event.currentTarget.checked ? "annually" : "monthly")
//               }
//               size="xl"
//               styles={{
//                 track: { backgroundColor: "#faf8f8" },
//                 thumb: { backgroundColor: "#4E00B2" },
//               }}
//             />
//             <Text fz={18} fw={600} ml={20}> {t.Yearly} </Text>
//             <span className={classes.off}> {t.Discount35} </span>
//           </Center>
//         </div>

//         <Center>
//           <Grid gutter={32} style={{ width: "80%" }}>
//             {data?.data.map((plan) => (
//               <Grid.Col key={plan.id} span={isMobile ? 12 : 4}>
//                 <div
//                   style={{
//                     backgroundColor: plan.name === "Pro Plan" ? "var(--color-1)" : "transparent",
//                     padding: "30px",
//                     borderRadius: "10px",
//                     width: "320px",
//                     border:
//                       plan.name === "Pro Plan"
//                         ? "var(--color-5)"
//                         : "1px solid rgb(191, 190, 190)",
//                   }}
//                 >
//                   <Group position="apart" mb={5}>
//                     <Text>{plan.name}</Text>
//                   </Group>
//                   <Text size="xl" weight={700}>
//                     {billingCycle === "monthly"
//                       ? `$ ${plan.pricing.monthly_price} / monthly`
//                       : `$ ${plan.pricing.yearly_price} / yearly`}
//                     <br />
//                     {billingCycle === "annually" && (
//                       <>
//                         {t.SavedMoney}: $ {plan.pricing.yearly_savings}
//                         <br />
//                       </>
//                     )}
//                   </Text>
//                   <ul
//                     style={{
//                       paddingLeft: "0",
//                       listStyle: "none",
//                       display: "flex",
//                       alignItems: "start",
//                       justifyContent: "start",
//                       flexDirection: "column",
//                       gap: "10px",
//                     }}
//                   >
//                     <li>
//                       <span style={{ color: "green", margin:"0px 10px" }}>✔</span>
//                       <span>{t.LimitRealState}</span> {" : "}
//                       {plan.features.listings_limit}
//                     </li>
//                     <li>
//                       <span style={{ color: "green" , margin:"0px 10px"}}>✔</span>
//                       <span>{t.LimitEmployees}</span> {" : "}
//                       {plan.features.employees_limit}
//                     </li>
//                     <li>
//                       <span style={{ color: "green", margin:"0px 10px" }}>✔</span>
//                       <span>{t.LimitSupervisors}</span> {" : "}
//                       {plan.features.supervisors_limit}
//                     </li>
//                   </ul>
//                   <Button
//                     fullWidth
//                     onClick={() => handleSubscribe(plan.id)}
//                     style={{
//                       backgroundColor: plan.name === "Pro Plan" ? "#fff" : "var(--color-1)",
//                       color: plan.name === "Pro Plan" ? "var(--color-1)" : "#f1f1f1",
//                       width: "200px",
//                       height: "50px",
//                       margin: "auto",
//                       borderRadius: "10px",
//                     }}
//                   >
//                     {t.Choose}
//                   </Button>
//                 </div>
//               </Grid.Col>
//             ))}
//           </Grid>
//         </Center>
//       </Card>
//     </>
//   );
// }

// export default SubscriptionPlans;
