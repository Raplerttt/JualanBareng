import React, { useState, useContext } from 'react';
import { FaPlus, FaBox, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import { AuthService } from '../../auth/authService';
import { AuthContext } from '../../auth/authContext';

const ProductsSection = ({ products, setProducts, categories, searchQuery, sortBy }) => {
  const { user } = useContext(AuthContext);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    price: '',
    stock: '',
    image: null,
    categoryId: '',
    description: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => p.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.productName.localeCompare(b.productName);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  // Fetch products to sync with backend
  const fetchProducts = async () => {
    try {
      const response = await AuthService.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      alert(`Failed to fetch products: ${error.message}`);
    }
  };

  // Handle add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    const {
      productName,
      price,
      stock,
      image,
      categoryId,
      description
    } = newProduct;
  
    if (!productName || !price || !stock || !image || !categoryId || !user?.id) {
      alert('Please fill in all required fields and ensure you are logged in.');
      return;
    }
  
    if (Number(price) <= 0 || Number(stock) < 0) {
      alert('Price must be greater than 0 and stock cannot be negative.');
      return;
    }
  
    if (!image.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
  
        const payload = {
          productName: productName.trim(),
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          imageBase64: base64Image,
          categoryId: parseInt(categoryId),
          description: description?.trim() || 'No description',
        };
  
        await AuthService.addProduct(payload);
        await fetchProducts();
  
        setNewProduct({
          productName: '',
          price: '',
          stock: '',
          image: null,
          categoryId: '',
          description: '',
        });
  
        alert('Product successfully added!');
      } catch (error) {
        console.error('Error adding product:', error.message);
        alert(`Failed to add product: ${error.message}`);
      }
    };
  
    reader.onerror = () => {
      alert("Failed to read the image file");
    };
  
    reader.readAsDataURL(image);
  };
  

  return (
    <>
      {/* Add Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaPlus className="mr-2 text-indigo-600" /> Add New Product
          </h2>
        </div>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={newProduct.productName}
                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="E.g., Nasi Goreng"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="E.g., 25000"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="E.g., 50"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() =>
                setNewProduct({
                  productName: '',
                  price: '',
                  stock: '',
                  image: null,
                  categoryId: '',
                  description: '',
                })
              }
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Reset Form
            </button>
          </div>
        </form>
      </motion.div>

      {/* Product List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaBox className="mr-2 text-indigo-600" /> Product List
            <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} item
            </span>
          </h2>
          <div className="text-sm text-gray-500">Showing all products</div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-400 mb-4">
              <FaBox className="text-xl" />
            </div>
            <p className="text-gray-500">No products found. Try a different search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:3000/${product.image}`}
                      alt={product.productName}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = '')}
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full shadow-md px-2 py-1 flex items-center text-sm">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">{product.rating || '0'}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.productName}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-indigo-600">
                        Rp {product.price?.toLocaleString('id-ID') || '0'}
                      </span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="flex mt-auto justify-between items-center">
                      <button
                        onClick={() => setEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Edit product ${product.productName}`}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteProductId(product.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Delete product ${product.productName}`}
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <EditProductModal
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        categories={categories}
        setProducts={setProducts}
        products={products}
      />
      <DeleteProductModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        deleteProductId={deleteProductId}
        setDeleteProductId={setDeleteProductId}
        products={products}
        setProducts={setProducts}
      />
    </>
  );
};

export default ProductsSection;