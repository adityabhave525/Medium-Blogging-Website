import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Signin from "./pages/Signin";

export default function App(){
  return <>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog" element={<Blog />} />

        </Routes>
      </BrowserRouter>
    </div>
  </>
}