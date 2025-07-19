import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EditProductModal = ({ editProduct, setEditProduct, categories, setProducts, products }) => {
  if (!editProduct) return null;

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (
      !editProduct.productName?.trim() ||
      !editProduct.price ||
      !editProduct.stock ||
      !editProduct.categoryId
    ) {
      alert('Harap isi semua kolom wajib.');
      return;
    }
    if (Number(editProduct.price) <= 0 || Number(editProduct.stock) < 0) {
      alert('Harga harus lebih dari 0 dan stok tidak boleh negatif.');
      return;
    }

    const updatedProduct = {
      ...editProduct,
      price: parseFloat(editProduct.price),
      stock: parseInt(editProduct.stock),
      categoryId: parseInt(editProduct.categoryId),
      description: editProduct.description?.trim() || 'Tidak ada deskripsi',
      image: editProduct.image instanceof File ? URL.createObjectURL(editProduct.image) : editProduct.image,
    };

    setProducts(products.map((p) => (p.id === editProduct.id ? updatedProduct : p)));
    setEditProduct(null);
    alert('Produk berhasil diperbarui!');
  };

  return (
    <AnimatePresence>
      {editProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Produk</h3>
              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <input
                    type="text"
                    value={editProduct.productName || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="number"
                      value={editProduct.price || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    value={editProduct.stock || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={editProduct.categoryId || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={editProduct.description || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files[0] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Perbarui Produk
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;