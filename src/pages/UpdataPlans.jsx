import {
  Card,
  Button,
  Group,
  Text,
  Center,
  Switch,
  Modal,
  Grid,
  GridCol,
  Badge,
} from "@mantine/core";
import { use, useEffect, useState } from "react";
import axiosInstance from "../api/config";
import { useAuth } from "../context/authContext";
import classes from "../styles/SubscriptionPlans.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useCurrentSubscription } from "../hooks/queries/useCurrentSubscription";
import { notifications } from "@mantine/notifications";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import { useTranslation } from "../context/LanguageContext";

function UpdataPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { t } = useTranslation();
  const { user } = useAuth();
  const [modalOpened, setModalOpened] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 991px)`);
  const role = sessionStorage.getItem("role") || localStorage.getItem("role");

  // --- 🔹 استخراج بيانات الخطط الحالية والاشتراك ---
  const { data: plansData } = useCurrentSubscription();
  const [currentPlanInfo, setCurrentPlanInfo] = useState(null);

  let successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard";
  if (role === "marketer") {
    successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard-Marketer";
  }

  // --- 🔹 جلب الخطة الحالية ---
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const response = await axiosInstance.get("stripe/subscriptions/current", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const stripeSub = response.data.data.stripe_subscription;
        if (stripeSub && stripeSub.items.data.length > 0) {
          const price = stripeSub.items.data[0].price;
          const planId = price.metadata.plan_id;
          const interval = price.recurring.interval;

          setCurrentPlanInfo({
            planId: planId,
            interval: interval === "year" ? "annually" : "monthly",
            isActive: response.data.data.subscription.stripe_status === "active",
          });
        }
      } catch (error) {
        console.error("Error fetching current plan:", error);
      }
    };

    if (user?.token) {
      fetchCurrentPlan();
    }
  }, [user?.token]);

  // --- 🔹 دالة تغيير الخطة ---
  const handleChangePlan = async (newPlanId) => {
    const selectedBillingPeriod = billingCycle; // "monthly" أو "annually"


      console.log(newPlanId);
      console.log(selectedBillingPeriod);
      
    try {
      const response = await axiosInstance.post(
        "subscriptions/change-plan-checkout",
        {
          plan_id: newPlanId,
          billing_period: selectedBillingPeriod,
          success_url: successUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.data.checkout_url) {
        // إعادة التوجيه إلى صفحة الدفع
        window.location.href = response.data.data.checkout_url;
      }
    } catch (error) {
      console.error("Error changing plan:", error);
      const message =
        error.response?.data?.message || "فشل في تغيير الخطة. حاول مرة أخرى.";
      notifications.show({
        title: "خطأ",
        message,
        color: "red",
      });
    }
  };

  return (
    <>
      {/* مودال التأكيد (اختياري للتجديد التلقائي) */}
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
                setBillingCycle(event.currentTarget.checked ? "annually" : "monthly")
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

          {/* رسالة الخطة الحالية */}
          {currentPlanInfo && (
            <Text c="blue" fw={700} mt="md">
              {t.CurrentPlanIs}:{" "}
              <Text span fw={800} c="black">
                Plan {currentPlanInfo.planId} ({currentPlanInfo.interval})
              </Text>
            </Text>
          )}
        </div>

        <Center>
          <Grid gutter={32} style={{ width: "80%" }}>
            {plansData?.data?.map((plan) => {
              const isCurrentPlan =
                currentPlanInfo &&
                plan.id.toString() === currentPlanInfo.planId &&
                ((billingCycle === "monthly" && currentPlanInfo.interval === "monthly") ||
                  (billingCycle === "annually" && currentPlanInfo.interval === "annually"));

              return (
                <Grid.Col key={plan.id} span={isMobile ? 12 : 4}>
                  <div
                    style={{
                      backgroundColor: plan.name === "Pro Plan" ? "var(--color-1)" : "transparent",
                      padding: "30px",
                      borderRadius: "10px",
                      width: "320px",
                      border:
                        plan.name === "Pro Plan"
                          ? "var(--color-5)"
                          : "1px solid rgb(191, 190, 190)",
                      position: "relative",
                    }}
                  >
                    {/* بطاقة الخطة الحالية */}
                    {isCurrentPlan && (
                      <Badge
                        color="green"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t.CurrentPlan}
                      </Badge>
                    )}

                    <Group position="apart" mb={5}>
                      <Text fw={700}>{plan.name}</Text>
                    </Group>
                    <Text size="xl" weight={700}>
                      {billingCycle === "monthly"
                        ? `$${plan.pricing.monthly_price} / ${t.Monthly}`
                        : `$${plan.pricing.yearly_price} / ${t.Yearly}`}
                      <br />
                      {billingCycle === "annually" && (
                        <>
                          {t.SavedMoney}: ${plan.pricing.yearly_savings}
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
                        <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
                        <span>{t.LimitRealState}</span> {" : "}
                        {plan.features.listings_limit}
                      </li>
                      <li>
                        <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
                        <span>{t.LimitEmployees}</span> {" : "}
                        {plan.features.employees_limit}
                      </li>
                      <li>
                        <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
                        <span>{t.LimitSupervisors}</span> {" : "}
                        {plan.features.supervisors_limit}
                      </li>
                    </ul>

                    {/* زر تغيير الخطة أو رسالة الحالية */}
                    <Button
                      fullWidth
                      onClick={() => !isCurrentPlan && handleChangePlan(plan.id)}
                      style={{
                        backgroundColor: isCurrentPlan
                          ? "#ccc"
                          : plan.name === "Pro Plan"
                          ? "#fff"
                          : "var(--color-1)",
                        color: isCurrentPlan
                          ? "#666"
                          : plan.name === "Pro Plan"
                          ? "var(--color-1)"
                          : "#f1f1f1",
                        width: "200px",
                        height: "50px",
                        margin: "auto",
                        borderRadius: "10px",
                        cursor: isCurrentPlan ? "not-allowed" : "pointer",
                      }}
                      disabled={isCurrentPlan}
                    >
                        {t.Update}
                      {/* {isCurrentPlan ? t.CurrentPlan : t.ChangePlan} */}
                    </Button>
                  </div>
                </Grid.Col>
              );
            })}
          </Grid>
        </Center>
      </Card>
    </>
  );
}

export default UpdataPlans;
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
//   Badge,
// } from "@mantine/core";
// import { use, useEffect, useState } from "react";
// import axiosInstance from "../api/config";
// import { useAuth } from "../context/authContext";
// import classes from "../styles/SubscriptionPlans.module.css";
// import { useMediaQuery } from "@mantine/hooks";
// import { useCurrentSubscription } from "../hooks/queries/useCurrentSubscription";
// import { notifications } from "@mantine/notifications";
// import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
// import { useTranslation } from "../context/LanguageContext";

// function UpdataPlans() {
//   const [billingCycle, setBillingCycle] = useState("monthly");
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [modalOpened, setModalOpened] = useState(false);
//   const isMobile = useMediaQuery(`(max-width: 991px)`);
//   const role = sessionStorage.getItem("role") || localStorage.getItem("role");

//   // --- 🔹 استخراج بيانات الاشتراك ---
//   const { data: plansData } = useCurrentSubscription(); // قائمة الخطط من الـ API
//   const [currentPlanInfo, setCurrentPlanInfo] = useState(null); // لتخزين معلومات الخطة الحالية

//   let successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard";
//   if (role === "marketer") {
//     successUrl = "https://real-estate-one-lake.vercel.app/#/dashboard-Marketer";
//   }

//   // --- 🔹 جلب بيانات الاشتراك الحالي ---
//   useEffect(() => {
//     const fetchCurrentPlan = async () => {
//       try {
//         const response = await axiosInstance.get("stripe/subscriptions/current", {
//           headers: { Authorization: `Bearer ${user?.token}` },
//         });

//         const stripeSub = response.data.data.stripe_subscription;
//         const subscription = response.data.data.subscription;

//         if (stripeSub && stripeSub.items.data.length > 0) {
//           const price = stripeSub.items.data[0].price;
//           const planId = price.metadata.plan_id;
//           const interval = price.recurring.interval; // "year" or "month"

//           setCurrentPlanInfo({
//             planId: planId,
//             interval: interval === "year" ? "annually" : "monthly",
//             isActive: subscription.stripe_status === "active",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching current plan:", error);
//         // ممكن تُظهر رسالة: "لم يتم العثور على اشتراك نشط"
//       }
//     };

//     if (user?.token) {
//       fetchCurrentPlan();
//     }
//   }, [user?.token]);

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

//       <HeaderMegaMenu />

//       <Card style={{ zIndex: "10", backgroundColor: "transparent" }}>
//         <div style={{ padding: "20px", textAlign: "center" }}>
//           <Text fz={50} className={classes.Choose}>
//             {t.ChooseYourPlan}
//           </Text>

//           <Center style={{ marginTop: "30px" }}>
//             <Text fz={18} fw={600} mr={20}>
//               {t.Monthly}
//             </Text>
//             <Switch
//               mr={20}
//               ml={20}
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
//             <Text fz={18} fw={600} ml={20}>
//               {t.Yearly}
//             </Text>
//             <span className={classes.off}> {t.Discount35} </span>
//           </Center>

//           {/* --- 🔹 رسالة الخطة الحالية --- */}
//           {currentPlanInfo && (
//             <Text c="blue" fw={700} mt="md">
//               {t.CurrentPlanIs}:{" "}
//               <Text span fw={800} c="black">
//                 Plan {currentPlanInfo.planId} - {currentPlanInfo.interval === "annually" ? t.Yearly : t.Monthly}
//               </Text>
//             </Text>
//           )}
//         </div>

//         <Center>
//           <Grid gutter={32} style={{ width: "80%" }}>
//             {plansData?.data.map((plan) => {
//               // تحديد إذا كانت هذه الخطة هي الحالية
//               const isCurrentPlan =
//                 currentPlanInfo &&
//                 plan.id.toString() === currentPlanInfo.planId &&
//                 ((billingCycle === "monthly" && currentPlanInfo.interval === "monthly") ||
//                   (billingCycle === "annually" && currentPlanInfo.interval === "annually"));

//               return (
//                 <Grid.Col key={plan.id} span={isMobile ? 12 : 4}>
//                   <div
//                     style={{
//                       backgroundColor:
//                         plan.name === "Pro Plan" ? "var(--color-1)" : "transparent",
//                       padding: "30px",
//                       borderRadius: "10px",
//                       width: "320px",
//                       border:
//                         plan.name === "Pro Plan"
//                           ? "var(--color-5)"
//                           : "1px solid rgb(191, 190, 190)",
//                       position: "relative",
//                     }}
//                   >
//                     {/* --- 🔹 بطاقة الخطة الحالية --- */}
//                     {isCurrentPlan && (
//                       <Badge
//                         color="green"
//                         variant="filled"
//                         style={{
//                           position: "absolute",
//                           top: 10,
//                           right: 10,
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {t.CurrentPlan}
//                       </Badge>
//                     )}

//                     <Group position="apart" mb={5}>
//                       <Text fw={700}>{plan.name}</Text>
//                     </Group>
//                     <Text size="xl" weight={700}>
//                       {billingCycle === "monthly"
//                         ? `$${plan.pricing.monthly_price} / ${t.Monthly}`
//                         : `$${plan.pricing.yearly_price} / ${t.Yearly}`}
//                       <br />
//                       {billingCycle === "annually" && (
//                         <>
//                           {t.SavedMoney}: ${plan.pricing.yearly_savings}
//                           <br />
//                         </>
//                       )}
//                     </Text>

//                     <ul
//                       style={{
//                         paddingLeft: "0",
//                         listStyle: "none",
//                         display: "flex",
//                         alignItems: "start",
//                         justifyContent: "start",
//                         flexDirection: "column",
//                         gap: "10px",
//                       }}
//                     >
//                       <li>
//                         <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
//                         <span>{t.LimitRealState}</span> {" : "}
//                         {plan.features.listings_limit}
//                       </li>
//                       <li>
//                         <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
//                         <span>{t.LimitEmployees}</span> {" : "}
//                         {plan.features.employees_limit}
//                       </li>
//                       <li>
//                         <span style={{ color: "green", margin: "0px 10px" }}>✔</span>
//                         <span>{t.LimitSupervisors}</span> {" : "}
//                         {plan.features.supervisors_limit}
//                       </li>
//                     </ul>

//                     {/* --- 🔹 زر اختيار الخطة (مقفول إذا كانت الخطة الحالية) --- */}
//                     <Button
//                       fullWidth
//                       component="a"
//                       href={isCurrentPlan ? undefined : "#"}
//                       onClick={(e) => {
//                         if (isCurrentPlan) {
//                           e.preventDefault();
//                           notifications.show({
//                             title: t.AlreadySubscribed,
//                             message: t.YouAreAlreadySubscribedToThisPlan,
//                             color: "blue",
//                           });
//                         }
//                       }}
//                       style={{
//                         backgroundColor: isCurrentPlan
//                           ? "#ccc"
//                           : plan.name === "Pro Plan"
//                           ? "#fff"
//                           : "var(--color-1)",
//                         color: isCurrentPlan
//                           ? "#666"
//                           : plan.name === "Pro Plan"
//                           ? "var(--color-1)"
//                           : "#f1f1f1",
//                         width: "200px",
//                         height: "50px",
//                         margin: "auto",
//                         borderRadius: "10px",
//                         cursor: isCurrentPlan ? "not-allowed" : "pointer",
//                       }}
//                       disabled={isCurrentPlan}
//                     >
//                       {isCurrentPlan ? t.CurrentPlan : t.Choose}
//                     </Button>
//                   </div>
//                 </Grid.Col>
//               );
//             })}
//           </Grid>
//         </Center>
//       </Card>
//     </>
//   );
// }

// export default UpdataPlans;