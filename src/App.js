import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//importamos los componentes
import ShowProducts from "./components/ShowProducts";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import InventoryMovement from "./components/InventoryMovement";

function App() {
   return (
      <div className="App">
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<ShowProducts />} />
               <Route path="/create" element={<CreateProduct />} />
               <Route path="/edit/:id" element={<EditProduct />} />
               <Route path="/inventory" element={<InventoryMovement />} />{" "}
            </Routes>
         </BrowserRouter>
      </div>
   );
}

export default App;
