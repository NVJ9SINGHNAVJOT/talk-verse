import { Grid } from "@mui/material"
import DashboardLayout from "@src/components/layout/DashboardLayout"

const Dashboard = () => {
  return (
    <div className="w-full">

      <Grid container height={"calc(100vh - 4rem)"}>

        <Grid 
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}

        >
          
          First
        </Grid>

        <Grid xs={12} sm={8} md={5} lg={6} height={"100%"}  >
          <DashboardLayout/>
        </Grid>

        <Grid item xs={4} lg={3}
          sx={{
            display: { xs: "none", md: "block" },
            padding: "2rem",
            bgcolor: "rgba(0,0,0,0.85)",
          }}
          height={"100%"}
        >
          First
        </Grid>

      </Grid>

    </div>
  )
}

export default Dashboard