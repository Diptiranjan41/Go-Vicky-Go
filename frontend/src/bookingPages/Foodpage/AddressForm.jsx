import { useState, useEffect } from 'react';
import { Mail, User, Phone, MapPin, Globe, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddressPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const countries = ['United States', 'Canada', 'United Kingdom', 'India'];
  const states = {
    'United States': ['California', 'Texas', 'New York', 'Florida'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia'],
    'United Kingdom': ['England', 'Scotland', 'Wales'],
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
      'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal'
    ],
  };

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('shippingAddress');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Live ZIP/Postal validation
  useEffect(() => {
    if (!formData.zipCode || !formData.country) {
      setErrors(prev => ({ ...prev, zipCode: undefined }));
      return;
    }

    const zipRegex = {
      'United States': /^\d{5}(-\d{4})?$/,
      'Canada': /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
      'United Kingdom': /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
      'India': /^\d{6}$/
    };

    const regex = zipRegex[formData.country];
    if (regex && !regex.test(formData.zipCode)) {
      setErrors(prev => ({ ...prev, zipCode: `Invalid ZIP/Postal Code for ${formData.country}` }));
    } else {
      setErrors(prev => ({ ...prev, zipCode: undefined }));
    }
  }, [formData.zipCode, formData.country]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    if (!formData.address1) newErrors.address1 = 'Street Address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP/Postal Code is required.';
    if (!formData.country) newErrors.country = 'Country is required.';

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0 && !errors.zipCode;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save to localStorage
      localStorage.setItem('shippingAddress', JSON.stringify(formData));
      setSuccessMessage('Address saved successfully! Redirecting to Payment...');

      // Navigate to PaymentPage1 after 2 seconds
      setTimeout(() => {
        navigate('/payment', { state: { address: formData } });
      }, 2000);
    }
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, error }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
        </div>
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full rounded-md border-0 py-3 pl-10 pr-4 bg-gray-800 text-white ring-1 ring-inset
            placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-cyan-400
            sm:text-sm sm:leading-6 transition-colors duration-200
            ${error ? 'ring-red-400' : 'ring-gray-700'}`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );

  const SelectField = ({ label, name, options, icon: Icon, error }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
        </div>
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`block w-full rounded-md border-0 py-3 pl-10 pr-10 bg-gray-800 text-white ring-1 ring-inset
            ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-cyan-400 sm:text-sm sm:leading-6 appearance-none
            transition-colors duration-200 ${error ? 'ring-red-400' : 'ring-gray-700'}`}
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Shipping Address</h1>
        <p className="text-gray-400 mb-4 text-lg">Fill out the form to continue with your order.</p>

        {successMessage && (
          <p className="bg-green-500 text-white text-center py-2 rounded mb-4">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" name="fullName" placeholder="Jane Doe" icon={User} error={errors.fullName} />
              <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" icon={Mail} error={errors.email} />
              <InputField label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 123-4567" icon={Phone} error={errors.phone} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Country" name="country" options={countries} icon={Globe} error={errors.country} />
              <InputField label="ZIP / Postal Code" name="zipCode" placeholder="10001" icon={MapPin} error={errors.zipCode} />
              <InputField label="Street Address" name="address1" placeholder="1234 Main St" icon={Home} error={errors.address1} />
              <InputField label="Apartment, Suite, etc. (Optional)" name="address2" placeholder="Apt 2B" icon={Home} />
              <InputField label="City" name="city" placeholder="New York" icon={MapPin} error={errors.city} />
              <SelectField label="State / Province" name="state" options={formData.country ? states[formData.country] || [] : []} icon={MapPin} error={errors.state} />
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="w-full flex justify-center items-center py-3 px-6 border border-transparent
              rounded-lg shadow-sm text-base font-medium text-black bg-cyan-400
              hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-cyan-300 transition-colors duration-200 transform hover:scale-105">
              Save Address and Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPage;
