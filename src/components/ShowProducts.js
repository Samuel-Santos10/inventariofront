import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
   Form,
   Table,
   Button,
   Container,
   Row,
   Col,
   Card,
   Badge,
   InputGroup,
} from "react-bootstrap";
import {
   FaSearch,
   FaPlus,
   FaEdit,
   FaTrash,
   FaTag,
   FaBoxOpen,
} from "react-icons/fa";

const endpoint = "http://localhost:8000/api";

const ShowProducts = () => {
   const [products, setProducts] = useState([]);
   const [search, setSearch] = useState("");
   const [minPrice, setMinPrice] = useState("");
   const [maxPrice, setMaxPrice] = useState("");
   const [minStock, setMinStock] = useState("");
   const [maxStock, setMaxStock] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getAllProducts();
   }, []);

   const getAllProducts = async () => {
      try {
         setLoading(true);
         const response = await axios.get(`${endpoint}/products`);
         setProducts(response.data);
         setLoading(false);
      } catch (error) {
         console.error("Error fetching products:", error);
         setLoading(false);
      }
   };

   const deleteProduct = async (id) => {
      if (
         window.confirm("¿Estás seguro de que deseas eliminar este producto?")
      ) {
         try {
            await axios.delete(`${endpoint}/product/${id}`);
            getAllProducts();
         } catch (error) {
            console.error("Error deleting product:", error);
         }
      }
   };

   const resetFilters = () => {
      setSearch("");
      setMinPrice("");
      setMaxPrice("");
      setMinStock("");
      setMaxStock("");
   };

   const filteredProducts = products.filter((product) => {
      return (
         product.name.toLowerCase().includes(search.toLowerCase()) &&
         (minPrice === "" || product.price >= parseFloat(minPrice)) &&
         (maxPrice === "" || product.price <= parseFloat(maxPrice)) &&
         (minStock === "" || product.stock >= parseInt(minStock)) &&
         (maxStock === "" || product.stock <= parseInt(maxStock))
      );
   });

   return (
      <Container fluid className="py-4 px-md-4">
         <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
               <h2 className="m-0 fs-4">Gestión de Inventario</h2>
               <div>
                  <Link to="/create" className="btn btn-success">
                     <FaPlus className="me-2" /> Crear Producto
                  </Link>
                  <Link to="/inventory" className="btn btn-info">
                     <FaBoxOpen className="me-2" /> Gestionar Inventario
                  </Link>
               </div>
            </Card.Header>

            <Card.Body>
               <div className="mb-4 p-3 bg-light rounded">
                  <Row className="g-3">
                     <Col md={12}>
                        <InputGroup>
                           <InputGroup.Text>
                              <FaSearch />
                           </InputGroup.Text>
                           <Form.Control
                              type="text"
                              placeholder="Buscar por nombre..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                           />
                        </InputGroup>
                     </Col>

                     <Col md={3}>
                        <InputGroup>
                           <InputGroup.Text>
                              <FaTag />
                           </InputGroup.Text>
                           <Form.Control
                              type="number"
                              placeholder="Precio Mínimo"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                           />
                        </InputGroup>
                     </Col>

                     <Col md={3}>
                        <InputGroup>
                           <InputGroup.Text>
                              <FaTag />
                           </InputGroup.Text>
                           <Form.Control
                              type="number"
                              placeholder="Precio Máximo"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                           />
                        </InputGroup>
                     </Col>

                     <Col md={3}>
                        <InputGroup>
                           <InputGroup.Text>
                              <FaBoxOpen />
                           </InputGroup.Text>
                           <Form.Control
                              type="number"
                              placeholder="Stock Mínimo"
                              value={minStock}
                              onChange={(e) => setMinStock(e.target.value)}
                           />
                        </InputGroup>
                     </Col>

                     <Col md={3}>
                        <InputGroup>
                           <InputGroup.Text>
                              <FaBoxOpen />
                           </InputGroup.Text>
                           <Form.Control
                              type="number"
                              placeholder="Stock Máximo"
                              value={maxStock}
                              onChange={(e) => setMaxStock(e.target.value)}
                           />
                        </InputGroup>
                     </Col>

                     <Col className="d-flex justify-content-end">
                        <Button
                           variant="secondary"
                           onClick={resetFilters}
                           className="px-4"
                        >
                           Limpiar Filtros
                        </Button>
                     </Col>
                  </Row>
               </div>

               {loading ? (
                  <div className="text-center py-5">
                     <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                     </div>
                     <p className="mt-3">Cargando productos...</p>
                  </div>
               ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-5">
                     <p className="mb-0">
                        No se encontraron productos que coincidan con los
                        filtros.
                     </p>
                  </div>
               ) : (
                  <div className="table-responsive">
                     <Table hover className="align-middle mb-0">
                        <thead className="bg-light">
                           <tr>
                              <th>Nombre</th>
                              <th>Descripción</th>
                              <th>Precio</th>
                              <th>Existencias</th>
                              <th className="text-center">Acciones</th>
                           </tr>
                        </thead>
                        <tbody>
                           {filteredProducts.map((product) => (
                              <tr key={product.id}>
                                 <td className="fw-bold">{product.name}</td>
                                 <td>
                                    {product.description.length > 100
                                       ? `${product.description.substring(
                                            0,
                                            100
                                         )}...`
                                       : product.description}
                                 </td>
                                 <td>
                                    <Badge bg="info" className="py-2 px-3 fs-6">
                                       ${product.price.toFixed(2)}
                                    </Badge>
                                 </td>
                                 <td>
                                    <Badge
                                       bg={
                                          product.stock > 10
                                             ? "success"
                                             : product.stock > 5
                                             ? "warning"
                                             : "danger"
                                       }
                                       className="py-2 px-3 fs-6"
                                    >
                                       {product.stock}
                                    </Badge>
                                 </td>
                                 <td>
                                    <div className="d-flex justify-content-center gap-2">
                                       <Link
                                          to={`/edit/${product.id}`}
                                          className="btn btn-warning"
                                       >
                                          <FaEdit />{" "}
                                          <span className="d-none d-md-inline ms-1">
                                             Editar
                                          </span>
                                       </Link>
                                       <Button
                                          variant="danger"
                                          onClick={() =>
                                             deleteProduct(product.id)
                                          }
                                       >
                                          <FaTrash />{" "}
                                          <span className="d-none d-md-inline ms-1">
                                             Eliminar
                                          </span>
                                       </Button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </Table>
                  </div>
               )}
            </Card.Body>

            <Card.Footer className="bg-white border-top">
               <div className="d-flex justify-content-between align-items-center">
                  <p className="text-muted mb-0">
                     Total: {filteredProducts.length} productos
                  </p>
                  <div>
                     <small className="text-muted">
                        Gestión Productos - Inventario
                     </small>
                  </div>
               </div>
            </Card.Footer>
         </Card>
      </Container>
   );
};

export default ShowProducts;
