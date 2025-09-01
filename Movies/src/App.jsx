import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './component/layout/Layout';
import Home from "./pages/home/Home";
import Movies from "./pages/Movies/Movies";
import Tvseries from "./pages/TV Series/Tvseries";
import MovieDetails from "./component/MovieDetails/MovieDetails";
import Search from "./pages/search/Search";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  let router =  createBrowserRouter([
    {path:"/",element :<Layout />, children:[ 
      {index: true ,element:<Home />},
      {path:"movies",element:<Movies />},
      {path:"tvSeries",element:<Tvseries />},
      {path:"movieDetails/:id",element:<MovieDetails type="movie"/>},
      {path:"tvDetails/:id",element:<MovieDetails type="tv"/>},
      {path:"search", element:<Search />}

     ]}
  ])
  const client =new QueryClient()
  return (
   <>
   <QueryClientProvider client={client}>
  <RouterProvider router={router}>

   </RouterProvider>
   </QueryClientProvider>
   
   </>
  );
}
