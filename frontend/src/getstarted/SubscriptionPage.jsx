import React, { useState, useEffect } from 'react';

// Helper to add CDN scripts to the document head
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script);
    });
};

// --- SVG Icons ---
const CheckIcon = ({ size = 16, className = '' }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const HotelIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 7h-8v6h8V7zm2-2H3v14h18V5zm-2 12H5V7h14v10zM8 11H6v2h2v-2z" />
    </svg>
);

const CarIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8h2v-2h14v2h2v-8l-2.08-5.99zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5S18.33 12 17.5 12zM5 8l1.5-4.5h11L19 8H5z" />
    </svg>
);

const BikeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 4.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5zM5 18c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm14 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-9.7-5.85l2.7-3.38c.43-.53.33-1.29-.24-1.69s-1.35-.28-1.78.25l-4.02 5.02c-.34.42-.36.99-.04 1.44l2.67 3.67c.34.47.96.64 1.49.38s.71-1.02.37-1.49l-1.38-1.89h3.77c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25H9.8l.5-2.5z" />
    </svg>
);

const FlightIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
);

const TrainIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5V21h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm2 0v-5h5v5h-5zm3.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

const SubscriptionIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-12-9h10v2H8v-2z" />
    </svg>
);

// Configuration for each booking type
const BOOKING_CONFIG = {
    hotel: { title: 'Hotel Booking', Icon: HotelIcon, color: 'text-blue-400' },
    car: { title: 'Car Rental', Icon: CarIcon, color: 'text-red-400' },
    bike: { title: 'Bike Rental', Icon: BikeIcon, color: 'text-green-400' },
    flight: { title: 'Flight Booking', Icon: FlightIcon, color: 'text-purple-400' },
    train: { title: 'Train Booking', Icon: TrainIcon, color: 'text-orange-400' },
    subscription: { title: 'Subscription Plan', Icon: SubscriptionIcon, color: 'text-yellow-400' },
};

// --- Components ---

const SubscriptionPage = ({ onPlanSelect }) => {
    const prices = {
        normal: 99,
        pro: 299,
        premium: 599,
    };

    const features = {
        normal: ["Basic trip wizard", "1 draft trip", "Standard suggestions"],
        pro: ["Unlimited drafts", "Advanced budget calculator", "Priority support", "Custom itineraries"],
        premium: ["Real-time deals", "Concierge tips", "Multi-destination optimizer", "All Pro features"],
    };

    const handleClick = (plan, amount) => {
        onPlanSelect(plan, amount);
    };

    return (
        <div className="bg-black text-white min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#e0e0e0]">Start Your Journey Today</h1>
                    <p className="mt-4 text-lg text-cyan-300">Plan smarter, save more, and personalize your trips.</p>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    {["normal", "pro", "premium"].map((plan) => {
                        const title = plan.charAt(0).toUpperCase() + plan.slice(1);
                        const price = prices[plan];
                        const isPro = plan === "pro";
                        return (
                            <div key={plan} className={`relative flex flex-col rounded-2xl border ${isPro ? "border-cyan-400 bg-gray-950 shadow-xl" : "border-gray-700 bg-gray-900"} shadow-lg p-6 hover:-translate-y-1 transition`}>
                                {isPro && <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-semibold uppercase px-3 py-1 rounded-full shadow">Most Popular</div>}
                                <h3 className="text-xl font-bold">{title}</h3>
                                <p className="mt-2 text-3xl font-extrabold text-cyan-400">₹{price} <span className="text-base font-medium">/month</span></p>
                                <ul className="mt-6 space-y-2 flex-1">
                                    {features[plan].map((item, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckIcon size={16} className="text-cyan-400 mt-1" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <button onClick={() => handleClick(plan, price)} className={`w-full px-4 py-3 text-sm font-semibold rounded-lg ${isPro ? "bg-cyan-600 text-black hover:bg-cyan-500" : "border border-cyan-400 text-cyan-400 hover:bg-gray-800"}`}>
                                        Choose {title}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PaymentPage = ({ onPaymentSuccess, bookingInfo }) => {
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!bookingInfo) return;

        try {
            const { type, plan, amount } = bookingInfo;
            if (!type || !plan || isNaN(amount) || amount <= 0) {
                 setError("Invalid booking information provided.");
                 return;
            }
            
            const config = BOOKING_CONFIG[type] || BOOKING_CONFIG.subscription;
            const taxRate = 0.18;
            const subtotal = amount;
            const taxes = subtotal * taxRate;
            const total = subtotal + taxes;

            setBookingDetails({ type, plan, subtotal, taxes, total, ...config });
        } catch (e) {
            console.error('Could not process booking details.', e);
            setError("An error occurred while setting up the payment page.");
        }
    }, [bookingInfo]);

    const handlePayment = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1;
            if (isSuccess) {
                onPaymentSuccess({
                    ...bookingDetails,
                    paymentMethod,
                    transactionId: `TXN${Date.now()}`,
                    paymentDate: new Date().toLocaleString(),
                });
            } else {
                setError('Payment failed. Please try again or use a different method.');
                setIsLoading(false);
            }
        }, 2000);
    };

    if (error) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="text-center p-8 bg-gray-900 rounded-lg shadow-lg">
                    <h2 className="text-2xl text-red-500 font-bold mb-4">Error</h2>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    const { Icon, title, plan, subtotal, taxes, total, color } = bookingDetails;

    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                <div className={`p-8 rounded-l-2xl flex flex-col`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-full bg-gray-800 border border-gray-700`}>
                            <Icon className={`w-8 h-8 ${color}`} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
                            <p className="text-gray-400 capitalize">{plan} Plan</p>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4 flex-grow">
                        <h2 className="text-lg font-semibold text-cyan-400 border-b border-gray-700 pb-2 mb-4">Amount Summary</h2>
                        <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-300"><span>Taxes (18%)</span><span>₹{taxes.toFixed(2)}</span></div>
                        <div className="border-t border-dashed border-gray-600 my-4"></div>
                        <div className="flex justify-between text-xl font-bold text-white"><span>Grand Total</span><span>₹{total.toFixed(2)}</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-6 text-center">This is a secure 256-bit SSL encrypted payment.</p>
                </div>
                <div className="p-8">
                    <h2 className="text-lg font-semibold text-cyan-400 mb-4">Choose Payment Method</h2>
                    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
                        {['upi', 'card', 'netbanking', 'wallet'].map(method => (
                            <button key={method} onClick={() => setPaymentMethod(method)} className={`w-full py-2.5 text-sm font-medium rounded-md transition-colors capitalize focus:outline-none ${paymentMethod === method ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
                                {method}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handlePayment}>
                        {paymentMethod === 'upi' && <div className="space-y-4"><label htmlFor="upi_id" className="block text-sm font-medium text-gray-400">Enter UPI ID</label><input type="text" id="upi_id" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="yourname@bank" /></div>}
                        {paymentMethod === 'card' && <div className="space-y-4"><div><label htmlFor="card_number" className="block text-sm font-medium text-gray-400">Card Number</label><input type="text" id="card_number" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="0000 0000 0000 0000" /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="expiry" className="block text-sm font-medium text-gray-400">Expiry</label><input type="text" id="expiry" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="MM / YY" /></div><div><label htmlFor="cvv" className="block text-sm font-medium text-gray-400">CVV</label><input type="password" id="cvv" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="•••" /></div></div></div>}
                        {paymentMethod === 'netbanking' && <div><label htmlFor="bank" className="block text-sm font-medium text-gray-400">Select Bank</label><select id="bank" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option></select></div>}
                        {paymentMethod === 'wallet' && <div><label htmlFor="wallet" className="block text-sm font-medium text-gray-400">Select Wallet</label><select id="wallet" required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"><option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option><option>Google Pay</option></select></div>}
                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full mt-8 bg-cyan-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300">
                            {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>) : (`Pay ₹${total.toFixed(2)}`)}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InvoicePage = ({ invoiceData, onNewPayment }) => {
    const { title, plan, total, transactionId } = invoiceData;

    const handleDownload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Invoice', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #: ${transactionId}`, 14, 40);
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 46);
        doc.setLineWidth(0.5);
        doc.line(14, 55, 196, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Booking Details', 14, 65);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${title} - ${plan}`, 14, 72);
        doc.autoTable({
            startY: 85,
            head: [['Description', 'Amount']],
            body: [['Total Paid', `₹${total.toFixed(2)}`]],
            theme: 'striped',
            headStyles: { fillColor: [34, 211, 238] },
        });
        const finalY = doc.lastAutoTable.finalY;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for your business!', 105, finalY + 20, { align: 'center' });
        doc.save(`invoice-${transactionId}.pdf`);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 text-center">
                <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center bg-green-500/20 rounded-full border-2 border-green-500">
                    <svg className="w-8 h-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-gray-400 mb-6">Your invoice has been generated.</p>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-left space-y-3 mb-8">
                    <div className="flex justify-between"><span className="text-gray-400">Total Paid:</span><span className="font-bold text-white">₹{total.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Transaction ID:</span><span className="font-mono text-xs text-gray-300">{transactionId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Service:</span><span className="text-white">{title} ({plan})</span></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={handleDownload} className="w-full sm:w-auto bg-cyan-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-colors">Download Invoice</button>
                    <button onClick={onNewPayment} className="w-full sm:w-auto bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">Choose Another Plan</button>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [currentPage, setCurrentPage] = useState('subscription'); // subscription, payment, invoice
    const [bookingInfo, setBookingInfo] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);

    useEffect(() => {
        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js')
        ]).then(() => {
            setScriptsLoaded(true);
        }).catch(error => {
            console.error("Failed to load scripts:", error);
        });
    }, []);

    const handlePlanSelection = (plan, amount) => {
        setBookingInfo({ type: 'subscription', plan, amount });
        setCurrentPage('payment');
    };

    const handlePaymentSuccess = (data) => {
        setInvoiceData(data);
        setCurrentPage('invoice');
    };

    const handleNewPayment = () => {
        setCurrentPage('subscription');
        setBookingInfo(null);
        setInvoiceData(null);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'payment':
                return <PaymentPage onPaymentSuccess={handlePaymentSuccess} bookingInfo={bookingInfo} />;
            case 'invoice':
                 if (!scriptsLoaded) {
                    return (
                        <div className="flex items-center justify-center min-h-screen bg-black text-white">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
                            <p className="ml-4">Loading invoice tools...</p>
                        </div>
                    );
                }
                return <InvoicePage invoiceData={invoiceData} onNewPayment={handleNewPayment} />;
            case 'subscription':
            default:
                return <SubscriptionPage onPlanSelect={handlePlanSelection} />;
        }
    };

    return (
        <React.StrictMode>
            {renderPage()}
        </React.StrictMode>
    );
}
