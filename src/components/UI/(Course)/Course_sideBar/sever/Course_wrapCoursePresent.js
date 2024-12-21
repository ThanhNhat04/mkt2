import AIR_BoxCourse from "@/components/UI/(Course)/AIR_BoxCourse"
import Grid from "@mui/material/Grid"

export default function Course_wrapCoursePresent({ data, department }) {
  return (
    <Grid container spacing={2}>
      {data.map((e, index) => {
        let depa;
        for (let i in department) {
          if (department[i]._id == e.department) {
            depa = department[i]
          }
        }
        return (
          <Grid key={index} item xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <AIR_BoxCourse data={e} department={depa} />
          </Grid>)
      })}
    </Grid>
  )
}