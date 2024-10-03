import BorrowBook from '../book/BorrowBook'
import SearchBook from './SearchBook'
import UserNav from './UserNav'

import Grid from '@mui/material/Grid'

export default function Dashboard() {
  // Select username from store

  return (
    <div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 0, md: 0 }}
        className="main-container">
        <Grid item xs={3} sx={{ minHeight: 500 }}>
          <UserNav />
        </Grid>
        <Grid item xs={9} className="pl-24">
          {/* <BorrowBook /> */}
          <SearchBook />
        </Grid>
      </Grid>
    </div>
  )
}
