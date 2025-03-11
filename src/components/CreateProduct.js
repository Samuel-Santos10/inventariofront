import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
   Form,
   Button,
   Container,
   Card,
   Row,
   Col,
   Alert,
} from "react-bootstrap";
import { FaSave, FaArrowLeft, FaPlus } from "react-icons/fa";

const endpoint = "http://localhost:8000/api/product";

const CreateProduct = () => {
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState(0);
   const [stock, setStock] = useState(0);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   const store = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await axios.post(endpoint, {
            name: name,
            description: description,
            price: price,
            stock: stock,
         });
         navigate("/");
      } catch (error) {
         console.error("Error creating product:", error);
         setError(
            "Ocurrió un error al crear el producto. Por favor, inténtalo de nuevo."
         );
         setLoading(false);
      }
   };

   return (
      <Container fluid className="py-4 px-md-4">
         <Card className="shadow-sm border-0">
            <Card.Header className="bg-success text-white py-3 d-flex align-items-center">
               <FaPlus className="me-2" />
               <h2 className="m-0 fs-4">Crear Nuevo Producto</h2>
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

               <Form onSubmit={store}>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-bold">Nombre</Form.Label>
                           <Form.Control
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              type="text"
                              placeholder="Ingrese el nombre del producto"
                              required
                           />
                        </Form.Group>
                     </Col>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-bold">Precio</Form.Label>
                           <Form.Control
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              required
                           />
                        </Form.Group>
                     </Col>
                  </Row>

                  <Form.Group className="mb-3">
                     <Form.Label className="fw-bold">Descripción</Form.Label>
                     <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describa las características del producto"
                        required
                     />
                  </Form.Group>

                  <Form.Group className="mb-4">
                     <Form.Label className="fw-bold">Stock Inicial</Form.Label>
                     <Form.Control
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                     />
                     <Form.Text className="text-muted">
                        Este será el inventario inicial del producto. Podrá
                        modificarlo más adelante en Gestión de Inventario.
                     </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-between mt-4">
                     <Link to="/" className="btn btn-secondary">
                        <FaArrowLeft className="me-2" /> Cancelar
                     </Link>
                     <Button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                     >
                        {loading ? (
                           <>
                              <span
                                 className="spinner-border spinner-border-sm me-2"
                                 role="status"
                                 aria-hidden="true"
                              ></span>
                              Guardando...
                           </>
                        ) : (
                           <>
                              <FaSave className="me-2" /> Guardar Producto
                           </>
                        )}
                     </Button>
                  </div>
               </Form>
            </Card.Body>
         </Card>
      </Container>
   );
};

export default CreateProduct;
