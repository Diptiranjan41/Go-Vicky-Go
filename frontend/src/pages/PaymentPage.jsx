import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';

// --- SVG Icons ---
const HotelIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v6h8V7zm2-2H3v14h18V5zm-2 12H5V7h14v10zM8 11H6v2h2v-2z" /></svg>);
const CarIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8h2v-2h14v2h2v-8l-2.08-5.99zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5S18.33 12 17.5 12zM5 8l1.5-4.5h11L19 8H5z" /></svg>);
const BikeIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 4.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5zM5 18c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm14 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-9.7-5.85l2.7-3.38c.43-.53.33-1.29-.24-1.69s-1.35-.28-1.78.25l-4.02 5.02c-.34.42-.36.99-.04 1.44l2.67 3.67c.34.47.96.64 1.49.38s.71-1.02.37-1.49l-1.38-1.89h3.77c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25H9.8l.5-2.5z" /></svg>);
const FoodIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" /></svg>);
const ProductIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z" /></svg>);
const FlightIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>);
const SubscriptionIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-12-9h10v2H8v-2z" /></svg>);
const ShoppingCartIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>);
const TrashIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>);

// --- Cart Context ---
const CartContext = createContext();

const initialCartState = {
    hotel: [], car: [], bike: [], food: [],
    product: [], flight: [], subscription: [],
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(initialCartState);

    const addItem = (item) => {
        // Adds a new item to the cart under its specific type.
        setCartItems(prev => ({
            ...prev,
            [item.type]: [...prev[item.type], { ...item, id: `${item.type}-${Date.now()}` }], // Ensure unique ID
        }));
    };

    const removeItem = (itemId, itemType) => {
        // Removes an item from the cart by its ID and type.
        setCartItems(prev => ({
            ...prev,
            [itemType]: prev[itemType].filter(item => item.id !== itemId),
        }));
    };

    // useMemo helps to avoid recalculating on every render unless cartItems changes.
    const cartSubtotal = useMemo(() => {
        return Object.values(cartItems).flat().reduce((total, item) => total + item.price, 0);
    }, [cartItems]);
    
    const taxAmount = useMemo(() => cartSubtotal * 0.18, [cartSubtotal]);
    const cartTotal = useMemo(() => cartSubtotal + taxAmount, [cartSubtotal, taxAmount]);

    const cartCount = useMemo(() => {
        return Object.values(cartItems).flat().length;
    }, [cartItems]);

    const value = {
        cartItems,
        addItem,
        removeItem,
        cartSubtotal,
        taxAmount,
        cartTotal,
        cartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Mock Data and Pages ---
const MOCK_DATA = {
    hotel: [{ name: 'Luxury Suite', price: 9800 }],
    car: [{ name: 'SUV Rental', price: 5500 }],
    bike: [{ name: 'Sports Bike', price: 2200 }],
    food: [{ name: 'Gourmet Pizza', price: 850 }],
    product: [{ name: 'Wireless Headphones', price: 7500 }],
    flight: [{ name: 'Round Trip to Paris', price: 85000 }],
    subscription: [{ name: 'Pro Annual Plan', price: 4999 }],
};

const PageLayout = ({ title, children }) => (
    <div className="w-full max-w-4xl p-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

const ItemCard = ({ item, type, icon: Icon, color }) => {
    const { addItem } = useContext(CartContext);
    // State to manage the price input for this specific card
    const [price, setPrice] = useState(item.price);

    const handleAddToCart = () => {
        // Use the price from the state when adding to cart
        const priceValue = Number(price);
        if (!isNaN(priceValue) && priceValue > 0) {
            addItem({ ...item, price: priceValue, type });
        } else {
            alert("Please enter a valid price.");
        }
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center flex flex-col items-center">
            <Icon className={`w-12 h-12 mb-3 ${color}`} />
            <h3 className="text-lg font-bold text-white flex-grow">{item.name}</h3>
            
            {/* Price input field */}
            <div className="relative my-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white text-center text-xl font-semibold pl-8 focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            <button
                onClick={handleAddToCart}
                className="w-full bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
            >
                Add to Cart
            </button>
        </div>
    );
};

const HotelPage = () => <PageLayout title="Book a Hotel"><ItemCard item={MOCK_DATA.hotel[0]} type="hotel" icon={HotelIcon} color="text-blue-400" /></PageLayout>;
const CarPage = () => <PageLayout title="Rent a Car"><ItemCard item={MOCK_DATA.car[0]} type="car" icon={CarIcon} color="text-red-400" /></PageLayout>;
const BikePage = () => <PageLayout title="Rent a Bike"><ItemCard item={MOCK_DATA.bike[0]} type="bike" icon={BikeIcon} color="text-green-400" /></PageLayout>;
const FoodPage = () => <PageLayout title="Order Food"><ItemCard item={MOCK_DATA.food[0]} type="food" icon={FoodIcon} color="text-yellow-400" /></PageLayout>;
const ProductPage = () => <PageLayout title="Shop Products"><ItemCard item={MOCK_DATA.product[0]} type="product" icon={ProductIcon} color="text-indigo-400" /></PageLayout>;
const FlightPage = () => <PageLayout title="Book a Flight"><ItemCard item={MOCK_DATA.flight[0]} type="flight" icon={FlightIcon} color="text-purple-400" /></PageLayout>;
const SubscriptionPage = () => <PageLayout title="Get a Subscription"><ItemCard item={MOCK_DATA.subscription[0]} type="subscription" icon={SubscriptionIcon} color="text-pink-400" /></PageLayout>;

// --- Payment Page Component ---
const PaymentPage = () => {
    const { cartItems, removeItem, cartSubtotal, taxAmount, cartTotal, cartCount } = useContext(CartContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentSuccess(true);
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold text-green-400">Payment Successful!</h1>
                <p className="text-gray-300 mt-2">Thank you for your purchase.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-4xl p-4 sm:p-8 bg-gray-900/50 border border-gray-700/50 rounded-2xl shadow-2xl">
            <h1 className="text-3xl font-extrabold text-white mb-6">Review Your Order</h1>
            {cartCount === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty.</p>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {Object.entries(cartItems).map(([type, items]) =>
                            items.length > 0 && (
                                <div key={type}>
                                    <h2 className="text-xl font-bold text-cyan-400 capitalize border-b border-gray-700 pb-2 mb-3">{type}s</h2>
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg mb-2">
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-sm text-gray-400">₹{item.price.toLocaleString()}</p>
                                            </div>
                                            <button onClick={() => removeItem(item.id, type)} className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-full">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 h-fit">
                        <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 mb-4">Amount Summary</h2>
                        <div className="space-y-2 text-gray-300">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartSubtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Taxes (18%)</span><span>₹{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                            <div className="border-t border-dashed border-gray-600 my-3"></div>
                            <div className="flex justify-between text-xl font-bold text-white"><span>Grand Total</span><span>₹{cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full mt-6 bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 disabled:bg-gray-600 flex items-center justify-center transition-all"
                        >
                            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState('hotel');

    const renderPage = () => {
        switch (page) {
            case 'hotel': return <HotelPage />;
            case 'car': return <CarPage />;
            case 'bike': return <BikePage />;
            case 'food': return <FoodPage />;
            case 'product': return <ProductPage />;
            case 'flight': return <FlightPage />;
            case 'subscription': return <SubscriptionPage />;
            case 'payment': return <PaymentPage />;
            default: return <HotelPage />;
        }
    };
    
    const NavButton = ({ pageName, children }) => (
        <button onClick={() => setPage(pageName)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${page === pageName ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-700'}`}>
            {children}
        </button>
    );

    return (
        <CartProvider>
            <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center p-4">
                <header className="w-full max-w-6xl mb-6 p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        <NavButton pageName="hotel">Hotel</NavButton>
                        <NavButton pageName="car">Car</NavButton>
                        <NavButton pageName="bike">Bike</NavButton>
                        <NavButton pageName="food">Food</NavButton>
                        <NavButton pageName="product">Products</NavButton>
                        <NavButton pageName="flight">Flights</NavButton>
                        <NavButton pageName="subscription">Subscriptions</NavButton>
                    </div>
                    <button onClick={() => setPage('payment')} className="relative p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <ShoppingCartIcon className="w-7 h-7 text-cyan-400" />
                        <CartContext.Consumer>
                            {({ cartCount }) => cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </CartContext.Consumer>
                    </button>
                </header>
                <main className="w-full flex-grow flex items-center justify-center">
                    {renderPage()}
                </main>
            </div>
        </CartProvider>
    );
}
