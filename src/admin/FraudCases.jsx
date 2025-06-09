import React, { useState } from 'react';

import FraudCaseTable from './components/FraudCaseTable';

import FraudFilterPanel from './components/FraudFilterPanel';

const FraudCases = () => {

const [filters, setFilters] = useState({

status: 'all',

dateRange: 'all',

search: ''

});

// Data dummy kasus penipuan

const [fraudCases, setFraudCases] = useState([

{

id: 1,

transactionId: 'TRX-001',

reporter: 'buyer_123',

amount: 1500000,

currency: 'IDR',

status: 'open',

reportedDate: '2023-06-01',

description: 'Pembeli tidak menerima barang setelah pembayaran',

evidence: ['chat_screen_1.png', 'payment_proof.jpg'],

notes: 'Seller tidak merespons chat'

},

{

id: 2,

transactionId: 'TRX-002',

reporter: 'seller_456',

amount: 2500000,

currency: 'IDR',

status: 'investigating',

reportedDate: '2023-06-03',

description: 'Pembeli melakukan chargeback ilegal',

evidence: ['transaction_log.pdf'],

notes: 'Sedang verifikasi dengan payment gateway'

},

{

id: 3,

transactionId: 'TRX-003',

reporter: 'buyer_789',

amount: 500000,

currency: 'IDR',

status: 'resolved',

reportedDate: '2023-05-28',

description: 'Barang tidak sesuai deskripsi',

evidence: ['product_photo_1.jpg', 'product_photo_2.jpg'],

notes: 'Refund telah diproses'

},

{

id: 4,

transactionId: 'TRX-004',

reporter: 'seller_101',

amount: 3000000,

currency: 'IDR',

status: 'closed',

reportedDate: '2023-06-05',

description: 'Pembeli menggunakan akun palsu',

evidence: ['id_card_fake.jpg'],

notes: 'Akun pembeli telah diblokir'

}

]);

// Update status kasus

const updateCaseStatus = (id, newStatus) => {

setFraudCases(prev => prev.map(c =>

c.id === id ? { ...c, status: newStatus } : c

));

};

// Blokir akun terkait kasus

const blockAccount = (id, accountType, accountId) => {

setFraudCases(prev => prev.map(c =>

c.id === id ? { ...c, status: 'closed', notes: `Akun ${accountType} ${accountId} diblokir` } : c

));

// Di sini seharusnya ada API call untuk blokir akun

};

// Filter data

const filteredCases = fraudCases.filter(fc => {

const matchesStatus = filters.status === 'all' || fc.status === filters.status;

const matchesSearch = fc.transactionId.toLowerCase().includes(filters.search.toLowerCase()) ||

fc.description.toLowerCase().includes(filters.search.toLowerCase());

return matchesStatus && matchesSearch;

});

return (

<div className="p-6">

<div className="flex justify-between items-center mb-6">

<h1 className="text-2xl font-bold text-gray-800">Kasus Penipuan</h1>

<div className="text-sm text-gray-500">

Total: {filteredCases.length} kasus

</div>

</div>

<FraudFilterPanel filters={filters} setFilters={setFilters} />

<div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

<FraudCaseTable

fraudCases={filteredCases}

updateCaseStatus={updateCaseStatus}

blockAccount={blockAccount}

/>

</div>

</div>

);

};

export default FraudCases;