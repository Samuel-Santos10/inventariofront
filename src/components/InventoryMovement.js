import React, { useState, useEffect } from "react";
import axios from "axios";
import {
   Container,
   Card,
   Form,
   Button,
   Row,
   Col,
   Alert,
   Badge,
} from "react-bootstrap";
import {
   FaSave,
   FaBoxOpen,
   FaArrowUp,
   FaArrowDown,
   FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const endpoint = "http://localhost:8000/api";

const InventoryMovement = () => {
   const [products, setProducts] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState("");
   const [movementType, setMovementType] = useState("entrada");
   const [quantity, setQuantity] = useState(1);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);
   const [validated, setValidated] = useState(false);
   const [search, setSearch] = useState("");

   useEffect(() => {
      getAllProducts();
   }, []);

   const getAllProducts = async () => {
      try {
         const response = await axios.get(`${endpoint}/products`);
         setProducts(response.data);
      } catch (error) {
         console.error("Error fetching products:", error);
         setError(
            "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde."
         );
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.currentTarget;

      if (form.checkValidity() === false) {
         e.stopPropagation();
         setValidated(true);
         return;
      }

      try {
         setLoading(true);
         setError(null);
         setSuccess(null);

         await axios.post(`${endpoint}/inventory_movement`, {
            product_id: selectedProduct,
            type: movementType,
            quantity: parseInt(quantity),
         });

         setSuccess(
            `Se ha registrado correctamente un ${movementType} de ${quantity} unidades`
         );

         // Recargar los productos para actualizar el stock
         getAllProducts();

         // Resetear el formulario
         setQuantity(1);
         setValidated(false);
      } catch (error) {
         console.error("Error registering movement:", error);

         if (error.response && error.response.status === 400) {
            setError(
               error.response.data.message ||
                  "Error: Stock insuficiente para realizar esta operación"
            );
         } else {
            setError(
               "Ocurrió un error al registrar el movimiento. Por favor, inténtalo de nuevo."
            );
         }
      } finally {
         setLoading(false);
      }
   };

   const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
   );

   const getSelectedProductStock = () => {
      if (!selectedProduct) return null;
      const product = products.find(
         (p) => p.id.toString() === selectedProduct.toString()
      );
      return product ? product.stock : 0;
   };

   return (
      <Container fluid className="py-4 px-md-4">
         <Row className="justify-content-center">
            <Col lg={8}>
               <Card className="shadow-sm border-0 mb-4">
                  <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                     <h2 className="m-0 fs-4">
                        <FaBoxOpen className="me-2" /> Actualización de
                        Inventario
                     </h2>
                  </Card.Header>

                  <Card.Body className="p-4">
                     {error && (
                        <Alert
                           variant="danger"
                           dismissible
                           onClose={() => setError(null)}
                        >
                           {error}
                        </Alert>
                     )}

                     {success && (
                        <Alert
                           variant="success"
                           dismissible
                           onClose={() => setSuccess(null)}
                        >
                           {success}
                        </Alert>
                     )}

                     <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                     >
                        
                        <Form.Group className="mb-4" controlId="productSelect">
                           <Form.Label className="fw-bold">
                              Seleccionar Producto
                           </Form.Label>
                           <Form.Select
                              required
                              value={selectedProduct}
                              onChange={(e) =>
                                 setSelectedProduct(e.target.value)
                              }
                              disabled={loading}
                           >
                              <option value="">
                                 Selecciona un producto...
                              </option>
                              {filteredProducts.map((product) => (
                                 <option key={product.id} value={product.id}>
                                    {product.name} - Stock: {product.stock}
                                 </option>
                              ))}
                           </Form.Select>
                           <Form.Control.Feedback type="invalid">
                              Por favor selecciona un producto.
                           </Form.Control.Feedback>
                        </Form.Group>

                        {selectedProduct && (
                           <div className="mb-4 p-3 bg-light rounded">
                              <Row>
                                 <Col>
                                    <p className="mb-1 fw-bold">
                                       Stock Actual:
                                    </p>
                                    <h3>
                                       <Badge
                                          bg={
                                             getSelectedProductStock() > 10
                                                ? "success"
                                                : getSelectedProductStock() > 5
                                                ? "warning"
                                                : "danger"
                                          }
                                          className="py-2 px-3"
                                       >
                                          {getSelectedProductStock()} unidades
                                       </Badge>
                                    </h3>
                                 </Col>
                              </Row>
                           </div>
                        )}

                        <Row className="mb-4">
                           <Col md={6}>
                              <Form.Group controlId="movementType">
                                 <Form.Label className="fw-bold">
                                    Tipo de Movimiento
                                 </Form.Label>
                                 <div>
                                    <Form.Check
                                       inline
                                       type="radio"
                                       label={
                                          <>
                                             <FaArrowUp className="text-success me-1" />{" "}
                                             Entrada
                                          </>
                                       }
                                       name="movementType"
                                       id="typeEntrada"
                                       value="entrada"
                                       checked={movementType === "entrada"}
                                       onChange={() =>
                                          setMovementType("entrada")
                                       }
                                       className="me-4"
                                    />
                                    <Form.Check
                                       inline
                                       type="radio"
                                       label={
                                          <>
                                             <FaArrowDown className="text-danger me-1" />{" "}
                                             Salida
                                          </>
                                       }
                                       name="movementType"
                                       id="typeSalida"
                                       value="salida"
                                       checked={movementType === "salida"}
                                       onChange={() =>
                                          setMovementType("salida")
                                       }
                                    />
                                 </div>
                              </Form.Group>
                           </Col>

                           <Col md={6}>
                              <Form.Group controlId="quantity">
                                 <Form.Label className="fw-bold">
                                    Cantidad
                                 </Form.Label>
                                 <Form.Control
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) =>
                                       setQuantity(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                 />
                                 <Form.Control.Feedback type="invalid">
                                    Por favor ingresa una cantidad válida.
                                 </Form.Control.Feedback>
                              </Form.Group>
                           </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-4">
                           <Link to="/" className="btn btn-secondary px-4">
                              Volver a Productos
                           </Link>
                           <Button
                              type="submit"
                              className="btn btn-success px-4"
                              disabled={loading}
                           >
                              {loading ? (
                                 <>
                                    <span
                                       className="spinner-border spinner-border-sm me-2"
                                       role="status"
                                       aria-hidden="true"
                                    ></span>
                                    Procesando...
                                 </>
                              ) : (
                                 <>
                                    <FaSave className="me-2" /> Registrar
                                    Movimiento
                                 </>
                              )}
                           </Button>
                        </div>
                     </Form>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
};

export default InventoryMovement;
