import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, Box, Input, Flex } from "@chakra-ui/react";
import { ProductTable } from "./ProductTable";
import { ProductionTable } from "./ProductionTable";
import { ProductModal } from "./ProductModal";
import { ProductionModal } from "./ProductionModal";
import { ResultsTable } from "./ResultsTable";
import { useState, useEffect } from "react";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

export const ProductionTabs = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [waste, setWaste] = useState("");
  const [productions, setProductions] = useState([]);
  const [results, setResults] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const { token } = useAuthProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token]);

  const calculateSubtotal = (quantity, waste) => {
    const subtotalValue = Number(quantity) - Number(waste);
    setSubtotal(subtotalValue);
  };

  const handleCreateProduct = () => {
    setProducts([...products, { name: productName, stock: Number(stock), _id: Date.now().toString() }]);
    setProductName("");
    setStock("");
    setIsProductModalOpen(false);
  };

  const handleEditProduct = (id, name, stock) => {
    setProductName(name);
    setStock(stock.toString());
    setIsEditing(true);
    setEditingProductId(id);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (isEditing) {
      const updatedProducts = products.map((product) =>
        product._id === editingProductId ? { ...product, name: productName, stock: Number(stock) } : product
      );
      setProducts(updatedProducts);
      setIsEditing(false);
      setEditingProductId(null);
    } else {
      handleCreateProduct();
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}products/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCreateProduction = () => {
    const newProduction = { product: selectedProduct, quantity: Number(quantity), waste: Number(waste), _id: Date.now().toString(), subtotal };
    setProductions([...productions, newProduction]);
    setSelectedProduct("");
    setQuantity("");
    setWaste("");
    setIsProductionModalOpen(false);
    setSubtotal(0);
  };

  const handleDeleteProduction = (id) => {
    setProductions(productions.filter((production) => production._id !== id));
  };

  const handleEditProduction = (id) => {
    const production = productions.find((production) => production._id === id);
    setSelectedProduct(production.product);
    setQuantity(production.quantity.toString());
    setWaste(production.waste.toString());
    setSubtotal(production.subtotal);
    setProductions(productions.filter((production) => production._id !== id));
    setIsProductionModalOpen(true);
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${BASE_URL}productions?startDate=${startDate}&endDate=${endDate}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error("Failed to fetch production results");
      }
    } catch (error) {
      console.error("Error fetching production results:", error);
    }
  };

  return (
    <Tabs variant="enclosed" colorScheme="teal">
      <TabList>
        <Tab>Create Product</Tab>
        <Tab>Create Production</Tab>
        <Tab>Results</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Button onClick={() => setIsProductModalOpen(true)} colorScheme="teal" mb={4}>
            Create Product
          </Button>

          <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />

          <ProductModal
            isOpen={isProductModalOpen}
            onClose={() => {
              setIsProductModalOpen(false);
              setIsEditing(false);
              setEditingProductId(null);
            }}
            productName={productName}
            setProductName={setProductName}
            stock={stock}
            setStock={setStock}
            isEditing={isEditing}
            productId={editingProductId}
            onSave={handleSaveProduct}
          />
        </TabPanel>

        <TabPanel>
          <Button onClick={() => setIsProductionModalOpen(true)} colorScheme="teal" mb={4}>
            Create Production
          </Button>

          <ProductionTable productions={productions} onEdit={handleEditProduction} onDelete={handleDeleteProduction} />

          <ProductionModal
            isOpen={isProductionModalOpen}
            onClose={() => setIsProductionModalOpen(false)}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            products={products}
            quantity={quantity}
            setQuantity={setQuantity}
            waste={waste}
            setWaste={setWaste}
            subtotal={subtotal}
            onSave={handleCreateProduction}
            calculateSubtotal={calculateSubtotal}
          />
        </TabPanel>

        <TabPanel>
          <Flex mb={4}>
            <Box mr={4}>
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>
            <Box mr={4}>
              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>
            <Button colorScheme="teal" onClick={fetchResults}>
              Fetch Results
            </Button>
          </Flex>

          <ResultsTable results={results} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
