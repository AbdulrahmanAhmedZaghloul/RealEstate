// Dependency imports
import { Card, Slider } from "@mantine/core";
import { useNavigate } from "react-router-dom";

// Local imports
import classes from "../../styles/profile.module.css";
import { useTranslation } from "../../context/LanguageContext";
import { useMyCurrentSubscription } from "../../hooks/queries/useMyCurrentSubscription";

export default function ProfilePlane() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    data: subscriptionData,
    isLoading,
    isError,
    error,
  } = useMyCurrentSubscription();
  console.log(subscriptionData);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateTimeProgress = () => {
    const startDate = new Date(subscriptionData?.start_date);
    const endDate = new Date(subscriptionData?.end_date);
    const today = new Date();

    const totalTime = endDate - startDate;
    const elapsedTime = today - startDate;

    if (today > endDate) return 100;
    if (today < startDate) return 0;

    const percentage = (elapsedTime / totalTime) * 100;
    return Math.round(percentage);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error?.message || "Error fetching subscription data."}</p>;

  return (
    <Card withBorder radius="lg" className={classes.planContainer}>
      <div className={classes.PlanGrid} style={{ padding: "20px" }}>
        <div className={classes.Plan}>
          <h3>
            {t.Current_Plan} ({subscriptionData?.plan_name || "Basic"})
          </h3>
          <p>
            {t.Active_until} {formatDate(subscriptionData?.end_date)}
          </p>
        </div>

        <div className={classes.Plan}>
          <h2>
            <span>
              <span className="icon-saudi_riyal">&#xea;</span>{" "}
              {subscriptionData?.price}
            </span>{" "}
            /{subscriptionData?.duration_days === 365 ? "Year" : "Month"}
          </h2>
        </div>
      </div>

      <div className={classes.memberdiv} style={{ padding: "20px" }}>
        <div className={classes.member} style={{ marginTop: "0px" }}>
          <h4>{calculateTimeProgress()} {t.team_remaing}</h4>
          <span>{calculateTimeProgress()}%</span>
        </div>
        <div className={classes.memberSlider}>
          <Slider
            value={calculateTimeProgress()}
            disabled
            styles={{
              track: { backgroundColor: "#f0f0f0" },
              bar: { backgroundColor: "var(--color-1)" },
              thumb: {
                backgroundColor: "#fff",
                border: "2px solid var(--color-1)",
              },
            }}
            className={classes.Slider}
          />
        </div>
      </div>

      <div
        onClick={() => navigate("/subscription-plans")}
        className={classes.Update}
      >
        <span style={{ color: "var(--color-1)" }}>
          {t.Update_plan}
        </span>
      </div>
    </Card>
  );
}

