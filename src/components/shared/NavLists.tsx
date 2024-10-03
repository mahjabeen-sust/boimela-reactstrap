import * as React from 'react'
import { Link } from 'react-router-dom'

import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone'
import PersonAddAlt1TwoToneIcon from '@mui/icons-material/PersonAddAlt1TwoTone'
import UpdateTwoToneIcon from '@mui/icons-material/UpdateTwoTone'
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'
import LayersIcon from '@mui/icons-material/Layers'
import AssignmentIcon from '@mui/icons-material/Assignment'

export const AdminNavLists = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Link to="/adminDashboard">
        <ListItemText primary="Dashboard" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BookTwoToneIcon />
      </ListItemIcon>
      <Link to="/addBook">
        <ListItemText primary="Add New Book" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <UpdateTwoToneIcon />
      </ListItemIcon>
      <Link to="/updateBook">
        <ListItemText primary="Update Books" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PersonAddAlt1TwoToneIcon />
      </ListItemIcon>
      <Link to="/addAuthor">
        <ListItemText primary="Add New Author" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ManageAccountsTwoToneIcon />
      </ListItemIcon>
      <Link to="/updateAuthor">
        <ListItemText primary="Update Authors" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PersonAddAlt1TwoToneIcon />
      </ListItemIcon>
      <Link to="/addCategory">
        <ListItemText primary="Add New Category" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ManageAccountsTwoToneIcon />
      </ListItemIcon>
      <Link to="/updateCategory">
        <ListItemText primary="Update Category" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <Link to="/allLoans">
        <ListItemText primary="All Loans" />
      </Link>
    </ListItemButton>
  </React.Fragment>
)

export const UserNavLists = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <Link to="/Dashboard">
        <ListItemText primary="Dashboard" />
      </Link>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BookTwoToneIcon />
      </ListItemIcon>
      <Link to="/borrowedBooks">
        <ListItemText primary="Borrowed Books" />
      </Link>
    </ListItemButton>
  </React.Fragment>
)
