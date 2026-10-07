import React, { useState } from 'react';
import { Edit, Trash2, ShoppingCart, Search, DollarSign } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Buyer } from '../types';

export const Buyers = () => {
  const { buyers, sales, addBuyer, updateBuyer, deleteBuyer } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [buyerName, setBuyerName] = useState('');

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(buyer.buyer_id).includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingBuyer(null);
    setBuyerName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (buyer: Buyer) => {
    setEditingBuyer(buyer);
    setBuyerName(buyer.buyer_name);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) return;

    if (editingBuyer) {
      updateBuyer(editingBuyer.buyer_id, { buyer_name: buyerName });
    } else {
      addBuyer({ buyer_name: buyerName });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="5. Registered Buyers & Mandis (BUYER)"
        subtitle="Catalog of agribusiness corporations, grain merchants, wholesale traders and retail buyers."
        actionLabel="Add Buyer"
        onAction={handleOpenAdd}
        badgeCount={buyers.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredBuyers.length}</span> of {buyers.length} buyers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Buyer ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Buyer / Firm Name</th>
                <th className="px-6 py-4 font-semibold">Total Orders Placed</th>
                <th className="px-6 py-4 font-semibold">Lifetime Purchase Volume</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredBuyers.map((buyer) => {
                const buyerSales = sales.filter((s) => s.buyer_id === buyer.buyer_id);
                const totalSpent = buyerSales.reduce(
                  (acc, s) => acc + s.quantity_sold_kg * s.unit_price,
                  0
                );
                const totalQty = buyerSales.reduce((acc, s) => acc + s.quantity_sold_kg, 0);

                return (
                  <tr key={buyer.buyer_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{buyer.buyer_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <ShoppingCart size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{buyer.buyer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                        {buyerSales.length} contract{buyerSales.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono font-bold text-emerald-700">
                          ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {totalQty.toLocaleString()} kg total
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(buyer)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Buyer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(buyer.buyer_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Buyer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBuyers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No buyers found</p>
                      <p className="text-sm text-gray-400 mt-1">Add a new commercial buyer or trading partner.</p>
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
        title={editingBuyer ? `Edit Buyer: ${editingBuyer.buyer_name}` : 'Add New Commercial Buyer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Buyer / Corporate Entity Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. ITC Agri Business Division, Kargil Trading"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="input-field text-sm"
            />
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
              {editingBuyer ? 'Save Changes' : 'Create Buyer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteBuyer(deletingId)}
        title="Delete Buyer"
        message="Are you sure you want to delete this buyer? Existing sale invoices associated with this buyer will be affected."
      />
    </div>
  );
};
