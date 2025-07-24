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

        <p style={{ color: "var(--color-P)" }}>
          {t.FromListings}
        </p>


        <Grid>

          <Grid className={classes.mtb}>
            <GridCol className={classes.BuiltGrid} span={{ base: 12, md: 6, sm: 12, lg: 7 }}>

              <Grid className={classes.shadow}>
                <GridCol span={{ base: 12, md: 6, sm: 12 }}>
                  <div className={classes.BuiltGridFlex}>
                    <h3>{t.BusinessOverview}</h3>
                    <p style={{ color: "var(--color-P)" }}>{t.GetSnapshot}</p>
                  </div>
                </GridCol>
                <GridCol span={{ base: 12, md: 6, sm: 12, }}>
                  <img className={classes.BuiltGridImage} src={ChartLight} alt=" image" />
                </GridCol>
              </Grid>

            </GridCol>

            <GridCol className={classes.BuiltGride} span={{ base: 12, md: 6, sm: 12, lg: 5 }}>
              <Grid className={classes.shadow}>
                <GridCol span={{ base: 12, md: 12, sm: 12 }}>
                  <div className={classes.BuiltGridCol}>
                    <h4>{t.RoleManagement}</h4>
                    <p style={{ color: "var(--color-P)" }}>{t.Assign} <br />
                      {t.without}
                    </p>
                  </div>
                </GridCol>
                <GridCol span={{ base: 12, md: 12, sm: 12 }}>
                  <img className={classes.BuiltGrideImage} src={FrameLight} alt=" image" />
                </GridCol>

              </Grid>
            </GridCol>
          </Grid>


          {/* ////////////////////////// */}

          <Grid className={classes.mtb}>

            <GridCol className={classes.BuiltGridSmart} span={{ base: 12, md: 6, sm: 12, lg: 6 }}>
              <Grid className={classes.shadow}>
                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <div className={classes.BuiltGridSmartFlex}>
                    <h3>{t.SmartProperty}</h3>
                    <p style={{ color: "var(--color-P)" }}>
                      {t.ViewManage}
                    </p>
                  </div>
                </GridCol>
                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <img className={classes.BuiltGridSmartImage} src={CardLight} alt=" image" />
                </GridCol>

              </Grid>

            </GridCol>

            <GridCol className={classes.BuiltGridSmart} span={{ base: 12, md: 6, sm: 12, lg: 6 }}>
              <Grid className={classes.shadow}>

                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <div className={classes.BuiltGridSmartFlex}>
                    <h3>{t.TeamChat}</h3>
                    <p style={{ color: "var(--color-P)" }}>
                      {t.Communicate}
                    </p>
                  </div>
                </GridCol>


                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <img className={classes.BuiltGridSmartImage1} src={EmployeesLight} alt=" image" />

                </GridCol>
              </Grid>

            </GridCol>


          </Grid>

          {/* /////////////////////////// */}

          <Grid className={classes.mtb}>

            <GridCol className={classes.BuiltGride} span={{ base: 12, md: 6, sm: 12, lg: 5 }}>
              <Grid className={classes.shadow}>
                <GridCol span={{ base: 12, md: 12, sm: 12 }}>

                  <div className={classes.BuiltGridCol}>
                    <h4>{t.Client}</h4>
                    <p style={{ color: "var(--color-P)" }}>{t.TrackProgress}</p>
                  </div>
                </GridCol>
                <GridCol span={{ base: 12, md: 12, sm: 12 }}>

                  <img className={classes.FramerLight} src={FramerLight} alt=" image" />

                </GridCol>

              </Grid>
            </GridCol>

            <GridCol className={classes.BuiltGrid} span={{ base: 12, md: 6, sm: 12, lg: 7 }}>
              <Grid className={classes.shadow}>
                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <div className={classes.BuiltGridFlex}>
                    <h3>{t.InstantPublishing}</h3>
                    <p style={{ color: "var(--color-P)" }}>
                      {t.Everyproperty}
                    </p>

                  </div>
                </GridCol>

                <GridCol span={{ base: 12, md: 6, sm: 12 }}>

                  <img className={classes.iphoneImage} src={iphoneLight} alt=" image" />

                </GridCol>

              </Grid>

            </GridCol>


          </Grid>
        </Grid>
      </section>
    </>
  )
}

export default BuiltTo