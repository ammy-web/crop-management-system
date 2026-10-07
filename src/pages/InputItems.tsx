import React, { useState } from 'react';
import { Edit, Trash2, Package, Search, DollarSign, Layers, AlertTriangle } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { InputItem } from '../types';

export const InputItems = () => {
  const { inputItems, addInputItem, updateInputItem, deleteInputItem } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InputItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    item_name: '',
    unit_of_measure: 'Bag (50kg)',
    current_stock_qty: 50,
    unit_cost: 350.0,
  });

  const totalInventoryValue = inputItems.reduce(
    (acc, item) => acc + item.current_stock_qty * item.unit_cost,
    0
  );

  const filteredItems = inputItems.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unit_of_measure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.item_id).includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      item_name: '',
      unit_of_measure: 'Bag (50kg)',
      current_stock_qty: 50,
      unit_cost: 350.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InputItem) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      unit_of_measure: item.unit_of_measure,
      current_stock_qty: item.current_stock_qty,
      unit_cost: item.unit_cost,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name.trim()) return;

    if (editingItem) {
      updateInputItem(editingItem.item_id, {
        item_name: formData.item_name,
        unit_of_measure: formData.unit_of_measure,
        current_stock_qty: Number(formData.current_stock_qty),
        unit_cost: parseFloat(String(formData.unit_cost)),
      });
    } else {
      addInputItem({
        item_name: formData.item_name,
        unit_of_measure: formData.unit_of_measure,
        current_stock_qty: Number(formData.current_stock_qty),
        unit_cost: parseFloat(String(formData.unit_cost)),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="4. Inventory & Input Catalog (INPUT_ITEM)"
        subtitle="Manage warehouses, stock quantities and unit acquisition costs for seeds, fertilizers, and agrochemicals."
        actionLabel="Add Input Item"
        onAction={handleOpenAdd}
        badgeCount={inputItems.length}
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total SKUs Tracked</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{inputItems.length} Items</p>
          </div>
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <Layers size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalInventoryValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock Alerts (&lt;50)</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {inputItems.filter((i) => i.current_stock_qty < 50).length} Items
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search input items or units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredItems.length}</span> of {inputItems.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Item ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Input Item Name</th>
                <th className="px-6 py-4 font-semibold">Unit of Measure</th>
                <th className="px-6 py-4 font-semibold">Current Stock Qty</th>
                <th className="px-6 py-4 font-semibold">Unit Cost (₹)</th>
                <th className="px-6 py-4 font-semibold">Total Stock Value</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredItems.map((item) => {
                const isLowStock = item.current_stock_qty < 50;
                const itemVal = item.current_stock_qty * item.unit_cost;

                return (
                  <tr key={item.item_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{item.item_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                          <Package size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{item.item_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {item.unit_of_measure}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-gray-900'}`}>
                          {item.current_stock_qty.toLocaleString()}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-800 font-semibold">
                      ₹{item.unit_cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-emerald-700 font-bold">
                      ₹{itemVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.item_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No input items found</p>
                      <p className="text-sm text-gray-400 mt-1">Add an agrochemical, seed or fertilizer SKU.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Item: ${editingItem.item_name}` : 'Add New Farm Input Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Urea Nitrogen Fertilizer"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label">Unit of Measure *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bag (50kg), Litre, Kg, Metric Tonne"
              value={formData.unit_of_measure}
              onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Current Stock Qty *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.current_stock_qty}
                onChange={(e) => setFormData({ ...formData, current_stock_qty: parseInt(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Unit Cost (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm py-2 px-4">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteInputItem(deletingId)}
        title="Delete Input Item"
        message="Are you sure you want to delete this input item? Past application logs referencing this item may be affected."
      />
    </div>
  );
};
