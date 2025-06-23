//Dependency imports
import{ useState, useEffect } from "react";
import { Card, Slider, useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";

//Local imports
import classes from "../../styles/profile.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import { useCurrentSubscription } from "../../hooks/queries/useCurrentSubscription";

export default function ProfilePlane() {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState("");
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
  const { data, isLoading, isError, error } = useCurrentSubscription();

   
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

  useEffect(() => {
    setSubscriptionData(data?.data || []);
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error}</p>;

  return (
    <Card
      withBorder
      radius="lg"
      className={classes.planContainer}
      style={{
        // border: "1px solid rgb(213, 213, 213)",
                  
      }}
    >
      <div className={classes.PlanGrid} style={{ padding: "20px" }}>
        <div className={classes.Plan}>
          <h3
            style={{
               
            }}
          >
            {t.Current_Plan} ({subscriptionData?.plan_name || "Basic"})
          </h3>
          <p
            style={{
               
            }}
          >
            {t.Active_until} {formatDate(subscriptionData?.end_date)}
          </p>
        </div>

        <div className={classes.Plan}>
          <h2
            style={{
               
            }}
          >
            <span
              style={{
                 
              }}
            >
              <span
                style={{
                   
                }}
                className="icon-saudi_riyal"
              >
                &#xea;{" "}
              </span>{" "}
              {subscriptionData?.plan?.price}
            </span>{" "}
            /{subscriptionData?.plan?.duration_days === 365 ? "Year" : "Month"}
          </h2>
        </div>
      </div>

      <div className={classes.memberdiv} style={{ padding: "20px" }}>
        {/* مدة الاشتراك */}
        <div className={classes.member} style={{ marginTop: "0px" }}>
          <h4
            style={{
               
            }}
          >
            {calculateTimeProgress()} {t.team_remaing}
          </h4>

          <span
            style={{
               
            }}
          >
            {calculateTimeProgress()}%
          </span>
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
        <span
          style={{
            color:   "var(--color-1)",
          }}
        >
          {t.Update_plan}
        </span>
      </div>
    </Card>
  );
}
