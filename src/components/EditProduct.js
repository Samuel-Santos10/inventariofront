import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
   Form,
   Button,
   Container,
   Card,
   Row,
   Col,
   Alert,
} from "react-bootstrap";
import { FaSave, FaBoxOpen, FaArrowLeft } from "react-icons/fa";

const endpoint = "http://localhost:8000/api/product/";

const EditProduct = () => {
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState(0);
   const [stock, setStock] = useState(0);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const navigate = useNavigate();
   const { id } = useParams();

   const update = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await axios.put(`${endpoint}${id}`, {
            name: name,
            description: description,
            price: price,
            // No enviamos el stock para que no se actualice desde aquí
         });
         navigate("/");
      } catch (error) {
         console.error("Error updating product:", error);
         setError(
            "Ocurrió un error al actualizar el producto. Por favor, inténtalo de nuevo."
         );
         setLoading(false);
      }
   };

   useEffect(() => {
      const getProductById = async () => {
         try {
            const response = await axios.get(`${endpoint}${id}`);
            setName(response.data.name);
            setDescription(response.data.description);
            setPrice(response.data.price);
            setStock(response.data.stock);
         } catch (error) {
            console.error("Error fetching product:", error);
            setError("No se pudo cargar la información del producto.");
         }
      };
      getProductById();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <Container fluid className="py-4 px-md-4">
         <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white py-3">
               <h2 className="m-0 fs-4">Editar Producto</h2>
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

               <Form onSubmit={update}>
                  <Row>
                     <Col md={6}>
                        <Form.Group className="mb-3">
                           <Form.Label className="fw-bold">Nombre</Form.Label>
                           <Form.Control
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              type="text"
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
                        required
                     />
                  </Form.Group>

                  <Form.Group className="mb-4">
                     <Form.Label className="fw-bold">Stock Actual</Form.Label>
                     <div className="d-flex align-items-center">
                        <Form.Control
                           value={stock}
                           type="number"
                           disabled
                           className="bg-light"
                        />
                        <Link to="/inventory" className="btn btn-info ms-3">
                           <FaBoxOpen className="me-2" /> Gestionar Inventario
                        </Link>
                     </div>
                     <Form.Text className="text-muted">
                        El stock solo puede ser modificado a través del módulo
                        de Gestión de Inventario.
                     </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-between mt-4">
                     <Link to="/" className="btn btn-secondary">
                        <FaArrowLeft className="me-2" /> Volver
                     </Link>
                     <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                     >
                        {loading ? (
                           <>
                              <span
                                 className="spinner-border spinner-border-sm me-2"
                                 role="status"
                                 aria-hidden="true"
                              ></span>
                              Actualizando...
                           </>
                        ) : (
                           <>
                              <FaSave className="me-2" /> Guardar Cambios
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

export default EditProduct;
