import { Link } from 'react-router-dom'
import { useState } from 'react'

import { styled, alpha } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import { IconButton } from '@mui/material'

import { UserNavLists } from '../shared/NavLists'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
)

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  // backgroundColor: alpha(theme.palette.common.white, 0.15),
  backgroundColor: '#fff',
  '&:hover': {
    //backgroundColor: alpha(theme.palette.common.white, 0.25)
    backgroundColor: '#fff'
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '10ch',
      '&:focus': {
        width: '13ch'
      }
    }
  }
}))

export default function UserNav() {
  const [open, setOpen] = useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            backgroundColor: '#1976d2'
          }}>
          {/* <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton> */}
          {/* <Search>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Search> */}
        </Toolbar>
        <Divider />
        <List component="nav">
          {UserNavLists}
          <Divider sx={{ my: 1 }} />
        </List>
      </Drawer>
    </Box>
  )
}

// export default function UserNav() {
//   return (
//     <div className="admin-nav-menu">
//       <ul>
//         <li>
//           <Link to="/dashboard">DashBoard</Link>
//         </li>
//         <li>
//           <Link to="/borrowedBooks">Borrowed Books</Link>
//         </li>
//       </ul>
//     </div>
//   )
// }
