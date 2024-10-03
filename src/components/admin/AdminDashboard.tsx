import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Grid from '@mui/material/Grid'

import type { RootState } from '../../store'
import AdminNav from './AdminNav'
import Books from '../book/Books'

export default function AdminDashboard() {
  // Select username from store
  const user = useSelector((state: RootState) => state.auth.user)

  // return user.role === 'USER' ? (
  //   <div className="unauthorized">
  //     <h1>Unauthorized</h1>
  //     <span>
  //       <NavLink to="/dashboard">Go to User DashBoard</NavLink>
  //     </span>
  //   </div>
  // ) : (
  return (
    <div>
      {/* <h1>Admin Dashboard</h1>
      <h2>
        Welcome {user?.firstName} {user?.lastName}
      </h2> */}
      {/* <Link to="/login">Log out</Link> */}

      {/* <Books /> */}

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 0, md: 0 }}
        className="main-container">
        <Grid item xs={3}>
          <AdminNav />
        </Grid>
        <Grid item xs={9} className="pl-24">
          <Books />
        </Grid>
      </Grid>
    </div>
  )
}
