// SubscriptionPlans.jsx
import {
  Card, Button, Group, Text, Badge, Center, Switch, Modal, Grid, GridCol,
} from "@mantine/core";
import { useState, useEffect } from "react";
import axiosInstance from "../api/config";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/header/logo-43.png";
import positionleft from "../assets/palne/positionleft.jpg";
import positionright from "../assets/palne/WhatsApp Image 2025-04-15 at 3.52.40 AM.jpeg";
import classes from "../styles/SubscriptionPlans.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useEditPlan } from "../hooks/mutations/useEditPlan";
import { useCurrentSubscription } from "../hooks/queries/useCurrentSubscription";
import { useCancelPlan } from "../hooks/mutations/useCancelPlan";

function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [cancelModalOpened, setCancelModalOpened] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const { data: currentSubscription, isLoading: isCurrentLoading, isError: isCurrrentError, error: currentError }
   = useCurrentSubscription();


  const navigate = useNavigate();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);

  const fetchCurrentPlan = async () => {
    try {
      setCurrentPlan(currentSubscription?.data);
      setSelectedPlan(currentSubscription?.data?.plan_id);
      setBillingCycle(currentSubscription?.data?.plan_id > 3 ? "annually" : "monthly");
    } catch (error) {
      setCurrentPlan(null);
      setSelectedPlan(null);
      console.log(error);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axiosInstance.get("subscriptions/plans", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Fetched Plans:", response.data.data);

      const fetchedPlans = response.data.data.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: {
          monthly: plan.duration_days === 30 ? `$${plan.price}/month` : null,
          annually: plan.duration_days === 365 ? `$${plan.price}/year` : null,
        },
        features: [
          plan.priority_support ? "Priority Support" : "Standard Support",
          plan.analytics_access ? "Analytics Access" : "No Analytics Access",
          plan.featured_listings ? "Featured Listings" : "Standard Listings",
          `Listings Limit: ${plan.listings_limit || "Unlimited"}`,
          `Employees Limit: ${plan.employees_limit || "Unlimited"}`,
          `Supervisors Limit: ${plan.supervisors_limit || "Unlimited"}`,
        ],
      }));
      console.log("Fetched Plans:", fetchedPlans);
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setModalOpened(true);
  };

  const mutationEditPlan = useEditPlan(user.token);
  const isEditPlanLoading = mutationEditPlan.isLoading;

  const handleSubscribe = async (planId, autoRenew) => {
    mutationEditPlan.mutate(planId, autoRenew);
    setModalOpened(false);
  };

  const mutationCancelPlan = useCancelPlan(user.token);
  const isCancelPlanLoading = mutationCancelPlan.isLoading;

  const cancelPlan = async () => {
    try {
      mutationCancelPlan.mutate();
      fetchCurrentPlan();
      setCancelModalOpened(false);
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptionPlans();
    fetchCurrentPlan();
  }, [currentSubscription]);
  // console.log(fetchSubscriptionPlans());

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Subscription auto-renewal"
        centered
        className={classes.zIndex}
      >
        <Text>Do you want to automatically renew your subscription?</Text>
        <Group position="center" mt="md">
          <Button
            color="green"
            onClick={() => {
              navigate("/MakePayment");
              handleSubscribe(selectedPlan, true);
            }}
          >
            Yes
          </Button>
          <Button
            color="red"
            onClick={() => {
              navigate("/MakePayment");
              handleSubscribe(selectedPlan, false);
            }}
          >
            No
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={cancelModalOpened}
        onClose={() => setCancelModalOpened(false)}
        title="WARNING: Cancel Subscription"
        centered
        className={classes.zIndex}
      >
        <Text>
          Are you sure you want to cancel your subscription? This action is
          irreversible and you might lose your money.
        </Text>
        <Group position="center" mt="md">
          <Button
            color="red"
            onClick={() => {
              cancelPlan();
            }}
          >
            Yes, Cancel
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setCancelModalOpened(false);
            }}
          >
            No, Keep
          </Button>
        </Group>
      </Modal>

      <div className={classes.positionright}>
        <img src={positionright} alt="" />
      </div>
      <div className={classes.positionleft}>
        <img src={positionleft} alt="" />
      </div>

      <header>
        <Grid className={classes.Gridheader}>
          <GridCol span={6} className={classes.logo}>
            <img src={logo} alt="" />
          </GridCol>

          <GridCol span={6} className={classes.login}>
            <button
              onClick={() => {
                logout();
              }}
            >
              Sign out
            </button>
          </GridCol>
        </Grid>
      </header>

      <Card>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "20px",
          }}
          className={classes.ChooseCard}
        >
          <Text fz={50} className={classes.Choose}>
            Choose your plan
          </Text>
          <Center className={classes.ChooseCard} style={{ marginTop: "30px" }}>
            <Text fz={18} fw={600} mr={20}>
              Monthly
            </Text>
            <Switch
              checked={billingCycle === "annually"}
              onChange={(event) =>
                setBillingCycle(
                  event.currentTarget.checked ? "annually" : "monthly"
                )
              }
              size="xl"
              styles={{
                track: {
                  backgroundColor:
                    "#faf8f8",
                },
                thumb: {
                  backgroundColor:
                    "#4E00B2"
                },
              }}
            />
            <Text fz={18} fw={600} ml={20}>
              Yearly
            </Text>
            <span className={classes.off}>35% OFF</span>
          </Center>
        </div>
        <Center className={classes.ChooseCard} style={{ padding: "20px" }}>
          <Grid gutter={32}
            style={{
              width: "80%",
            }}
            className={classes.ChooseCard}
          >
            {plans
              .filter((plan) =>
                billingCycle === "monthly"
                  ? plan.price.monthly
                  : plan.price.annually
              )
              .map((plan) => (
                <Grid.Col span={isMobile ? 12 : 4} key={plan.id}>
                  <div
                    style={{
                      backgroundColor:
                        plan.name === "Professional" ||
                          plan.name === "Enterprise Annual"
                          ? "var(--color-1)"
                          : "transparent",
                      padding: "40px",
                      borderRadius: "20px",
                      width: "320px",
                      border:
                        plan.name === "Professional" ||
                          plan.name === "Enterprise Annual"
                          ? "1px solid rgb(92, 25, 179)"
                          : "1px solid rgb(191, 190, 190)",
                    }}
                  >
                    <Group position="apart" style={{ marginBottom: 5 }}>
                      <Text
                        className={classes.textPalne}
                        style={{
                          color:
                            plan.name === "Professional" ||
                              plan.name === "Enterprise Annual"
                              ? "#fff"
                              : "var(--color-2);",
                        }}
                      >
                        {plan.name}
                      </Text>
                    </Group>
                    <Text
                      size="xl"
                      weight={700}
                      style={{
                        color:
                          plan.name === "Professional" ||
                            plan.name === "Enterprise Annual"
                            ? "#fff"
                            : "var(--color-2);",
                      }}
                    >
                      {billingCycle === "monthly"
                        ? plan.price.monthly
                        : plan.price.annually}
                    </Text>

                    <ul style={{ paddingLeft: "0px", marginBottom: "20px" }}>
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            color:
                              plan.name === "Professional" ||
                                plan.name === "Enterprise Annual"
                                ? "#fff"
                                : "var(--color-2);",
                          }}
                          className={classes.customli}
                        >
                          <span
                            style={{
                              color:
                                plan.name === "Professional" ||
                                  plan.name === "Enterprise Annual"
                                  ? "#fff"
                                  : "var(--color-1)",
                              marginRight: "10px",
                            }}
                          >
                            ✔
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      fullWidth
                      variant={selectedPlan === plan.id ? "filled" : "outline"}
                      color={
                        hovered && selectedPlan === plan.id ? "red" : "blue"
                      }
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      onClick={() =>
                        hovered && selectedPlan === plan.id
                          ? setCancelModalOpened(true)
                          : handleSelectPlan(plan.id)
                      }
                      style={{
                        backgroundColor:
                          plan.name === "Professional" ||
                            plan.name === "Enterprise Annual"
                            ? "#fff"
                            : "var(--color-1)",
                        color:
                          plan.name === "Professional" ||
                            plan.name === "Enterprise Annual"
                            ? "var(--color-1)"
                            : "#fff",
                        width: "200px",
                        height: "50px",
                        margin: "auto",
                        border:
                          plan.name === "Professional" ||
                            plan.name === "Enterprise Annual"
                            ? "1px solid rgb(191, 190, 190)"
                            : "#fff",
                        borderRadius: "10px",
                      }}
                    >
                      {hovered && selectedPlan === plan.id
                        ? "Cancel Plan"
                        : selectedPlan === plan.id
                          ? "Selected"
                          : "Select Plan"}
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
