'use client'

import { Search } from 'lucide-react'

export default function AdminCustomersPage() {
  const customers = [
    { name: 'Kabir Singh', email: 'kabir@example.com', orders: 3, spent: '₹8,197', joined: 'Mar 2026', status: 'Active' },
    { name: 'Aryan Patel', email: 'aryan.p@example.com', orders: 1, spent: '₹1,999', joined: 'Mar 2026', status: 'Active' },
    { name: 'Rohan Sharma', email: 'rohan.s@example.com', orders: 2, spent: '₹4,198', joined: 'Feb 2026', status: 'Active' },
    { name: 'Aditya Gupta', email: 'aditya.g@example.com', orders: 1, spent: '₹2,199', joined: 'Feb 2026', status: 'Active' },
    { name: 'Vikram Singh', email: 'vikram.s@example.com', orders: 1, spent: '₹0', joined: 'Jan 2026', status: 'Refunded' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-[#111]">Customers</h1>
        <p className="text-[#666] font-medium">{customers.length} registered customers</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#EAEAEA] flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
            <input type="text" placeholder="Search customers..." className="w-full bg-[#F5F5F5] border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#111]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#EAEAEA]">
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[#999] text-[10px]">Customer</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[#999] text-[10px]">Joined</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[#999] text-[10px]">Orders</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[#999] text-[10px]">Total Spent</th>
                <th className="py-4 px-6 font-black uppercase tracking-widest text-[#999] text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEFEF]">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#F5F5F5] rounded-full flex items-center justify-center font-black text-sm text-[#111] border border-[#EAEAEA]">
                        {c.name[0]}
                      </div>
                      <div>
                        <span className="block font-bold text-sm text-[#111]">{c.name}</span>
                        <span className="block text-xs font-medium text-[#888]">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-sm text-[#888]">{c.joined}</td>
                  <td className="py-4 px-6 font-black text-sm text-[#111]">{c.orders}</td>
                  <td className="py-4 px-6 font-black text-sm text-[#111]">{c.spent}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider ${c.status === 'Active' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
