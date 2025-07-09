import { Grid, GridCol } from '@mantine/core'
import classes from "../../styles/Home.module.css";
import ChartLight from "../../assets/Home/Chart.png";
import CardLight from "../../assets/Home/card (1) 1.png";
import FrameLight from "../../assets/Home/Frame 56.png";
import EmployeesLight from "../../assets/Home/Employees (3).png";
import FramerLight from "../../assets/Home/Frame 1984077916 (1).png";
import iphoneLight from "../../assets/Home/iphone 18 1 (1).png";

function BuiltTo() {
  return (
    <>

      <section className={classes.Built}>
        <h2>Built to Empower Your Real  <br /> Estate Workflow</h2>

        <p>
          From listings to contracts manage everything in one smart platform.
        </p>


        <Grid>

          <Grid className={classes.mtb}>
            <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 7 }}>
              <div className={classes.shadow}>
                <div className={classes.BuiltGridFlex}>
                  <h3>Business Overview at a Glance</h3>
                  <p>Get a quick snapshot of your real estate performance total listings, contracts,
                    team activity, and more. Everything you need to make informed decisions, instantly visible..</p>
                </div>

                <img className={classes.BuiltGridImage} src={ChartLight} alt=" image" />
              </div>

            </GridCol>

            <GridCol className={classes.BuiltGride} span={{ base: 6, md: 6, sm: 12, lg: 5 }}>
              <div className={classes.shadow}>

                <div className={classes.BuiltGridCol}>
                  <h4>Team & Role Management</h4>
                  <p>Assign roles and track team activity <br /> without hassle.</p>
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
                  <h3>Smart Property Management</h3>
                  <p>
                    View, search, and manage all your property listings in one place. Add new properties, update statuses, and filter with ease.
                    Whether you're managing 10 or 1,000 listings  it's always simple.
                  </p>
                </div>
                <img className={classes.BuiltGridSmartImage} src={CardLight} alt=" image" />
              </div>

            </GridCol>

            <GridCol className={classes.BuiltGridSmart} span={{ base: 6, md: 6, sm: 12, lg: 6 }}>
              <div className={classes.shadow}>

                <div className={classes.BuiltGridSmartFlex}>
                  <h3>Built-In Team Chat</h3>
                  <p>
                    Communicate directly with your team without leaving the platform.
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
                  <h4>Client Request Handling</h4>
                  <p>Track progress, mark matched requests, and never miss an opportunity.</p>
                </div>
                <img className={classes.FramerLight} src={FramerLight} alt=" image" />
              </div>
            </GridCol>

            <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 7 }}>
              <div className={classes.shadow}>
                <div className={classes.BuiltGridFlex}>
                  <h3>Instant Mobile App Publishing</h3>
                  <p>Every property you list is automatically published to your mobile app no extra steps needed.One system. One action. Everywhere it matters.</p>

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