import { Grid, GridCol } from '@mantine/core'
import classes from "../../styles/Home.module.css";
import ChartLight from "../../assets/Home/Chart.png";
import CardLight from "../../assets/Home/card (1) 1.png";
import FrameLight from "../../assets/Home/Frame 56.png";
import EmployeesLight from "../../assets/Home/Employees (3).png";
import FramerLight from "../../assets/Home/Frame 1984077916 (1).png";
import iphoneLight from "../../assets/Home/iphone 18 1 (1).png";
import { useTranslation } from '../../context/LanguageContext';

function BuiltTo() {
  const { t } = useTranslation();

  return (
    <>

      <section className={classes.Built}>
        <h2>{t.Empower}  <br /> {t.Workflow}</h2>

        <p>
          {t.FromListings}
        </p>


        <Grid>

          <Grid className={classes.mtb}>
            <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 7 }}>
              <div className={classes.shadow}>
                <div className={classes.BuiltGridFlex}>
                  <h3>{t.BusinessOverview}</h3>
                  <p>{t.GetSnapshot}</p>
                </div>

                <img className={classes.BuiltGridImage} src={ChartLight} alt=" image" />
              </div>

            </GridCol>

            <GridCol className={classes.BuiltGride} span={{ base: 6, md: 6, sm: 12, lg: 5 }}>
              <div className={classes.shadow}>

                <div className={classes.BuiltGridCol}>
                  <h4>{t.RoleManagement}</h4>
                  <p>{t.Assign} <br />
                    {t.without}
                  </p>
                </div>
                <img className={classes.BuiltGrideImage} src={FrameLight} alt=" image" />
              </div>
            </GridCol>
          </Grid>


          {/* ////////////////////////// */}

          <Grid className={classes.mtb}>

            <GridCol className={classes.BuiltGridSmart} span={{ base: 6, md: 6, sm: 12, lg: 6 }}>
              <div className={classes.shadow}>
                <div className={classes.BuiltGridSmartFlex}>
                  <h3>{t.SmartProperty}</h3>
                  <p>
                    {t.ViewManage}
                  </p>
                </div>
                <img className={classes.BuiltGridSmartImage} src={CardLight} alt=" image" />
              </div>

            </GridCol>

            <GridCol className={classes.BuiltGridSmart} span={{ base: 6, md: 6, sm: 12, lg: 6 }}>
              <div className={classes.shadow}>

                <div className={classes.BuiltGridSmartFlex}>
                  <h3>{t.TeamChat}</h3>
                  <p>
                    {t.Communicate}
                  </p>
                </div>
                <img className={classes.BuiltGridSmartImage} src={EmployeesLight} alt=" image" />

              </div>

            </GridCol>


          </Grid>

          {/* /////////////////////////// */}

          <Grid className={classes.mtb}>

            <GridCol className={classes.BuiltGride} span={{ base: 6, md: 6, sm: 12, lg: 5 }}>
              <div className={classes.shadow}>

                <div className={classes.BuiltGridCol}>
                  <h4>{t.Client}</h4>
                  <p>{t.TrackProgress}</p>
                </div>
                <img className={classes.FramerLight} src={FramerLight} alt=" image" />
              </div>
            </GridCol>

            <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 7 }}>
              <div className={classes.shadow}>
                <div className={classes.BuiltGridFlex}>
                  <h3>{t.InstantPublishing}</h3>
                  <p>
                    {t.Everyproperty}
                  </p>

                </div>

                <img className={classes.iphoneImage} src={iphoneLight} alt=" image" />
              </div>

            </GridCol>


          </Grid>
        </Grid>
      </section>
    </>
  )
}

export default BuiltTo