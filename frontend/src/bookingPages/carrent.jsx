import React, { useRef, useEffect, Suspense, useState, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/*
  NOTE: This single-file React component is a full front-end mock of a car rental page.
  It embeds your provided 3D car scene (kept as-is) and adds:
  - Navbar + responsive layout
  - Search / filter bar (location, dates, passengers)
  - Car listing with simulated availability and pricing
  - Booking modal that saves bookings to localStorage (mock backend)
  - Booking history panel and simple success flow
  - Tailwind utility classes for styling (assumes Tailwind CSS is available)

  Drop this file into a React app that has Tailwind set up and @react-three/fiber + drei.
*/

/* -----------------------
   --- 3D Scene (your code unchanged, wrapped into CarShowcase) ---
   -----------------------*/

// Road and lane marking component (static)
const Road = () => {
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: '#2D3748', // Dark asphalt color
    metalness: 0.1,
    roughness: 0.8,
  });

  const curbMaterial = new THREE.MeshStandardMaterial({
    color: '#8A8A8A', // Concrete gray
    metalness: 0.1,
    roughness: 0.8,
  });

  const laneMaterial = new THREE.MeshStandardMaterial({
    color: '#E2E8F0', // White for lane markings
    metalness: 0.1,
    roughness: 0.8,
  });

  return (
    <group>
      {/* Main road plane */}
      <mesh material={roadMaterial} rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
      </mesh>
      {/* Curb */}
      <mesh material={curbMaterial} position={[0, -0.25, 5.0]} castShadow receiveShadow>
        <boxGeometry args={[20, 0.5, 0.2]} />
      </mesh>
      {/* Sidewalk */}
      <mesh material={curbMaterial} position={[0, -0.4, 5.4]} castShadow receiveShadow>
        <boxGeometry args={[20, 0.2, 0.8]} />
      </mesh>
      {/* Lane markings */}
      {[...Array(11)].map((_, index) => (
        <mesh
          key={index}
          material={laneMaterial}
          rotation-x={-Math.PI / 2}
          position={[index * 2 - 10, -0.49, 0]}
        >
          <boxGeometry args={[1, 0.1, 0.1]} />
        </mesh>
      ))}
    </group>
  );
};

// A more realistic, low-poly man with animation
const Man = () => {
  const group = useRef();
  const head = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  useFrame((state) => {
    if (head.current) {
      head.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (leftArm.current) {
      leftArm.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
    if (rightArm.current) {
      rightArm.current.rotation.x = -Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#5A67D8' });
  const headMaterial = new THREE.MeshStandardMaterial({ color: '#FEEBC8' });
  const legMaterial = new THREE.MeshStandardMaterial({ color: '#2C5282' });

  return (
    <group ref={group} position={[-2, 0.3, -2.5]}>
      <mesh material={bodyMaterial} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.3]} />
      </mesh>
      <mesh ref={head} material={headMaterial} position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      <mesh material={legMaterial} position={[0.1, -0.4, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
      </mesh>
      <mesh material={legMaterial} position={[-0.1, -0.4, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
      </mesh>
      <mesh ref={leftArm} material={bodyMaterial} position={[0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
      </mesh>
      <mesh ref={rightArm} material={bodyMaterial} position={[-0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
      </mesh>
    </group>
  );
};

// Driver component inside the car with animation
const Driver = () => {
  const group = useRef();
  const hand = useRef();

  useFrame((state) => {
    if (hand.current) {
      hand.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#4A5568' });
  const headMaterial = new THREE.MeshStandardMaterial({ color: '#FEEBC8' });
  const armMaterial = new THREE.MeshStandardMaterial({ color: '#4A5568' });

  return (
    <group ref={group} position={[0.5, -0.1, -0.2]}>
      <mesh material={bodyMaterial} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.2]} />
      </mesh>
      <mesh material={headMaterial} position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      <mesh ref={hand} material={armMaterial} position={[0.2, 0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.1]} />
      </mesh>
    </group>
  );
};

// Car component (static)
const Car = () => {
  const group = useRef();

  const carMaterial = new THREE.MeshStandardMaterial({
    color: '#1A202C',
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1,
  });

  const grilleMaterial = new THREE.MeshStandardMaterial({
    color: '#A0AEC0',
    metalness: 0.9,
    roughness: 0.2,
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: '#C4E5E5',
    emissive: '#C4E5E5',
    emissiveIntensity: 5,
    metalness: 0.9,
    roughness: 0.2,
  });

  const windowMaterial = new THREE.MeshPhysicalMaterial({
    color: '#3B82F6',
    metalness: 0.8,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh material={carMaterial} castShadow>
        <boxGeometry args={[3.4, 0.6, 1.4]} />
      </mesh>
      <mesh material={carMaterial} position={[1.2, 0.05, 0]} castShadow>
        <boxGeometry args={[1.0, 0.4, 1.3]} />
      </mesh>
      <mesh material={carMaterial} position={[-1.4, -0.2, 0.7]} rotation-y={Math.PI / 4} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh material={carMaterial} position={[1.4, -0.2, 0.7]} rotation-y={-Math.PI / 4} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh material={carMaterial} position={[-1.4, -0.2, -0.7]} rotation-y={-Math.PI / 4} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh material={carMaterial} position={[1.4, -0.2, -0.7]} rotation-y={Math.PI / 4} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh material={carMaterial} position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 1.2]} />
      </mesh>
      <mesh material={windowMaterial} position={[0, 0.4, 0.61]}>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
      </mesh>
      <mesh material={windowMaterial} position={[0, 0.4, -0.61]}>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
      </mesh>
      <mesh material={grilleMaterial} position={[1.75, 0.1, 0.2]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>
      <mesh material={grilleMaterial} position={[1.75, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.5, 0.3]} />
      </mesh>
      <mesh material={headlightMaterial} position={[1.65, 0.15, 0.55]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
      </mesh>
      <mesh material={headlightMaterial} position={[1.65, 0.15, -0.55]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.2]} />
      </mesh>
      <mesh material={carMaterial} position={[1.75, -0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 1.3]} />
      </mesh>
      <mesh material={carMaterial} position={[-1.75, -0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 1.3]} />
      </mesh>
      {[[-1.4, -0.4, 0.7], [1.4, -0.4, 0.7], [-1.4, -0.4, -0.7], [1.4, -0.4, -0.7]].map((pos, index) => (
        <mesh key={index} position={pos} receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
          <meshStandardMaterial color="#4A4A4A" metalness={1} roughness={0.5} />
        </mesh>
      ))}
      <Driver />
    </group>
  );
};

// Street light component
const StreetLight = () => {
  const poleMaterial = new THREE.MeshStandardMaterial({ color: '#4A5568' });
  const light = useRef();

  return (
    <group position={[1, 5, -2]}>
      <mesh material={poleMaterial} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 5, 16]} />
      </mesh>
      <mesh material={poleMaterial} position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>
      <pointLight ref={light} position={[0, 2.5, 0]} intensity={15} color="#FEEBC8" castShadow />
    </group>
  );
};

// Camera setup for the canvas
const CameraSetup = () => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2, 2.5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
};

// Wrap the 3D scene into a small component we can reuse
const CarShowcase = ({ className = 'w-full h-96 rounded-xl overflow-hidden shadow-2xl' }) => {
  return (
    <div className={className} style={{ background: 'linear-gradient(180deg,#0f172a,#000)' }}>
      <Canvas camera={{ position: [2, 2.5, 5], fov: 60 }} shadows>
        <CameraSetup />
        <Suspense fallback={null}>
          <Car />
          <Road />
          <Man />
          <StreetLight />
          <Environment preset="night" />
          <ContactShadows resolution={1024} opacity={0.8} scale={10} blur={1} far={10} position={[0, -0.5, 0]} />
          <ambientLight intensity={0.15} />
        </Suspense>
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} enableZoom={true} autoRotate={false} minDistance={3} maxDistance={12} />
      </Canvas>
    </div>
  );
};

/* -----------------------
   --- App UI: Car rental page
   -----------------------*/

// Simple booking context
const BookingContext = createContext();

const useBookings = () => useContext(BookingContext);

const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const raw = localStorage.getItem('demo_bookings');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('demo_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (b) => setBookings((s) => [b, ...s]);
  const clearBookings = () => setBookings([]);

  return <BookingContext.Provider value={{ bookings, addBooking, clearBookings }}>{children}</BookingContext.Provider>;
};

// Navbar
const Navbar = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center font-semibold text-slate-900">VR</div>
        <div>
          <div className="font-bold text-white">VickyRentals</div>
          <div className="text-xs text-slate-400">Drive your dream</div>
        </div>
      </div>
      <nav className="hidden md:flex gap-6 items-center text-slate-300">
        <a className="hover:text-white" href="#cars">Cars</a>
        <a className="hover:text-white" href="#how">How it works</a>
        <a className="hover:text-white" href="#about">About</a>
        <button className="ml-4 bg-cyan-500 px-4 py-2 rounded-md text-slate-900 font-medium">Sign in</button>
      </nav>
      <div className="md:hidden">{/* mobile menu placeholder */}</div>
    </header>
  );
};

// Filter/Search bar
const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('Bhubaneswar');
  const [from, setFrom] = useState('2025-08-20');
  const [to, setTo] = useState('2025-08-22');
  const [passengers, setPassengers] = useState(4);

  return (
    <div className="w-full bg-slate-800/40 rounded-xl p-4 flex flex-col md:flex-row md:flex-wrap gap-3 items-center">
      <input value={location} onChange={(e) => setLocation(e.target.value)} className="p-3 rounded-md bg-slate-900 text-white w-full md:w-48" placeholder="Pick-up city" />
      <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="p-3 rounded-md bg-slate-900 text-white" />
      <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="p-3 rounded-md bg-slate-900 text-white" />
      <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="p-3 rounded-md bg-slate-900 text-white">
        {[2, 4, 5, 7, 8].map((p) => (
          <option key={p} value={p}>{p} passengers</option>
        ))}
      </select>
      <button onClick={() => onSearch({ location, from, to, passengers })} className="ml-auto bg-cyan-500 px-4 py-2 rounded-md font-semibold text-slate-900">Search</button>
    </div>
  );
};

// Sample car data
const SAMPLE_CARS = [
  { id: 'c1', make: 'BMW', model: 'Series 3', seats: 5, pricePerDay: 4500, img: '', fuel: 'Petrol' },
  { id: 'c2', make: 'Hyundai', model: 'Creta', seats: 5, pricePerDay: 2200, img: '', fuel: 'Diesel' },
  { id: 'c3', make: 'Maruti', model: 'Swift', seats: 4, pricePerDay: 1500, img: '', fuel: 'Petrol' },
  { id: 'c4', make: 'Toyota', model: 'Innova', seats: 7, pricePerDay: 3800, img: '', fuel: 'Diesel' },
];

// Car card
const CarCard = ({ car, onBook }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
      <div className="w-36 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-slate-200 font-semibold">{car.make} {car.model}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">{car.make} {car.model}</div>
            <div className="text-sm text-slate-400">{car.seats} seats • {car.fuel}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{car.pricePerDay}</div>
            <div className="text-sm text-slate-400">/ day</div>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <button onClick={() => onBook(car)} className="bg-cyan-500 px-4 py-2 rounded-md text-slate-900 font-semibold">Book now</button>
          <button className="px-3 py-2 rounded-md border border-slate-700 text-slate-300">Details</button>
        </div>
      </div>
    </div>
  );
};

// Booking modal (simple)
const BookingModal = ({ car, query, onClose }) => {
  const { addBooking } = useBookings();
  const [name, setName] = useState('Guest User');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!car) return null;

  const handleConfirm = () => {
    const booking = {
      id: 'b_' + Date.now(),
      carId: car.id,
      carName: `${car.make} ${car.model}`,
      from: query.from,
      to: query.to,
      location: query.location,
      passenger: query.passengers,
      price: car.pricePerDay,
      customer: { name, phone, notes },
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    onClose();
    alert('Booking confirmed! (saved locally)');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 rounded-xl p-6 w-full max-w-xl z-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">Confirm booking — {car.make} {car.model}</h3>
            <p className="text-sm text-slate-400">{query.location} • {query.from} → {query.to}</p>
          </div>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="p-3 rounded-md bg-slate-800 text-white" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="p-3 rounded-md bg-slate-800 text-white" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="p-3 rounded-md bg-slate-800 text-white col-span-1 md:col-span-2" />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-700 text-slate-300">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold">Confirm & pay ₹{car.pricePerDay}</button>
        </div>
      </div>
    </div>
  );
};

// Main page
const MainPage = () => {
  const [query, setQuery] = useState({ location: 'Bhubaneswar', from: '2025-08-20', to: '2025-08-22', passengers: 4 });
  const [filtered, setFiltered] = useState(SAMPLE_CARS);
  const [selected, setSelected] = useState(null);
  const { bookings } = useBookings();

  useEffect(() => {
    // initial filter: seats >= passengers
    setFiltered(SAMPLE_CARS.filter((c) => c.seats >= query.passengers));
  }, []);

  const handleSearch = (q) => {
    setQuery(q);
    const res = SAMPLE_CARS.filter((c) => c.seats >= q.passengers);
    setFiltered(res);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 3D Showcase + How it works */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CarShowcase />
          <div className="bg-slate-900/60 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">Find your ride</h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          <section id="how" className="bg-slate-900/50 rounded-xl p-6 mt-4">
            <h3 className="text-xl font-semibold mb-2">How it works</h3>
            <ol className="list-decimal list-inside text-slate-300">
              <li>Search for dates and location.</li>
              <li>Choose a car and confirm booking details.</li>
              <li>Pay &amp; collect the car at the pick-up location.</li>
            </ol>
          </section>
        </div>

        {/* Right: Car list + Bookings */}
        <aside className="flex flex-col gap-6">
          <div id="cars" className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Available cars</h3>
            <div className="flex flex-col gap-3">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} onBook={(c) => setSelected(c)} />
              ))}
              {filtered.length === 0 && <div className="text-slate-400">No cars match your search. Try changing dates or passengers.</div>}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Your recent bookings</h3>
            {bookings.length === 0 ? (
              <div className="text-slate-400">You have no bookings yet.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="p-2 rounded-md bg-slate-800/40 text-slate-200">
                    <div className="font-medium">{b.carName}</div>
                    <div className="text-sm text-slate-400">{b.from} → {b.to} • {b.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div id="about" className="bg-slate-900/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2">About VickyRentals</h3>
            <p className="text-sm text-slate-400">A demo car rental UI built for learning — includes 3D preview and local booking persistence. Replace localStorage with your backend API for production.</p>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-slate-400">© {new Date().getFullYear(2025)}   Go Vicky Go — Car Rent. </footer>

      {/* Booking modal */}
      {selected && <BookingModal car={selected} query={query} onClose={() => setSelected(null)} />}
    </div>
  );
};

// Root App wrapper
const AppWrapper = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
        <Navbar />
        <MainPage />
      </div>
    </BookingProvider>
  );
};

export default AppWrapper;