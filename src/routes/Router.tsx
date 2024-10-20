import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.tsx"));
const MinimalLayout = lazy(() => import("../layouts/MinimalLayout.tsx"));

/***** Pages ****/

const Books = lazy(() => import("../components/book/Books.tsx"));
const Borrowed = lazy(() => import("..//components/user/Borrowed.tsx"));
const Dashboard = lazy(() => import("../components/user/Dashboard.tsx"));
const AddBook = lazy(() => import("../components/book/AddBook.tsx"));
const AuthorForm = lazy(() => import("../components/author/AuthorForm.tsx"));
const EditAuthor = lazy(() => import("../components/author/EditAuthor.tsx"));
const CategoryForm = lazy(
  () => import("../components/category/CategoryForm.tsx")
);
const EditCategory = lazy(
  () => import("../components/category/EditCategory.tsx")
);
const BooksTable = lazy(() => import("../components/book/BooksTable.tsx"));
const SignIn = lazy(() => import("../components/shared/SignIn.tsx"));
const SignUp = lazy(() => import("../components/shared/SignUp.tsx"));

/*****Routes******/
export const ThemeRoutes = [
  // MinimalLayout for public routes
  {
    path: "/",
    element: <MinimalLayout />, // MinimalLayout as parent for public routes
    children: [
      { path: "/", element: <Books /> }, // Public route redirects to books
      { path: "login", element: <SignIn /> },
      { path: "logout", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "*", element: <Books /> }, // Fallback for non-matching routes
    ],
  },
  {
    // Protected routes for authenticated users
    element: <ProtectedRoute />, // Protects user routes
    children: [
      {
        path: "/",
        element: <FullLayout />, // FullLayout as parent for private routes
        children: [
          { path: "books", element: <Books /> }, // "/books" route
          { path: "dashboard", element: <Dashboard /> }, // "/dashboard" route
          { path: "borrowed", element: <Borrowed /> }, // "/borrowed" route
        ],
      },
    ],
  },
  {
    // Protected routes for admin users
    element: <AdminRoute />, // Protects admin routes
    children: [
      {
        path: "/",
        element: <FullLayout />, // FullLayout as parent for admin routes
        children: [
          { path: "adminDashboard", element: <Books /> },
          { path: "addBook", element: <AddBook /> },
          { path: "updateBook", element: <BooksTable /> },
          { path: "addAuthor", element: <AuthorForm /> },
          { path: "updateAuthor", element: <EditAuthor /> },
          { path: "addCategory", element: <CategoryForm /> },
          { path: "updateCategory", element: <EditCategory /> },
        ],
      },
    ],
  },
];

export default ThemeRoutes;
