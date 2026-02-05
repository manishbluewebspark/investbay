import { useState, useEffect, useRef } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiSearch,
  FiX
} from 'react-icons/fi';
import PriceLevels from '../../components/modals/PricesLevels';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateSignal = ({ data, onNext, onClose, onSignalCreated }) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user).id;

  const [planOptions, setPlanOptions] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [formData, setFormData] = useState({
    segment: '',
    instrument: '',
    script: '',
    expire: '',
    instrumentType: '',
    strike_price: '',
    tradeDirection: '',
    exchange: '',
    duration: '',
    riskRewardRatio: '',
    position_status: '',
    subscriptionPlan: ''
  });

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
      if (data.subscriptionPlan) {
        setSelectedPlan(data.subscriptionPlan);
      }
    }
  }, [data]);

  const instrumentTypes = ['CE', 'PE', 'FUT', 'EQ'];
  const tradeDirections = ['BUY', 'SELL'];
  const segments = ['Options', 'F&O'];
  const instrument = ['index', 'nifty'];
  const position_status = ['Active', 'Inactive']
  const exchanges = ['NSE', 'BSE', 'MCX'];
  const durations = ['Intraday', 'BTST/STBT', '0-7 Days', '1-4 Weeks', '1 Month'];

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const handleSelect = (field, value, planId = null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'subscriptionPlan') {
      setSelectedPlan(value);
      setSelectedPlanId(planId);
    }

    setActiveDropdown(null)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const dataToSend = {
      ...formData,
      subscriptionPlan: selectedPlan || formData.subscriptionPlan,
      planId: selectedPlanId,
      userId: userId,
    };

    if (onNext) {
      onNext(dataToSend);
    } else {
      setParentData(dataToSend);
      setShowPriceModal(true);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  const isFormValid = () => {
    return (
      (selectedPlan || formData.subscriptionPlan) &&
      formData.instrument &&
      formData.instrumentType &&
      formData.tradeDirection &&
      formData.segment &&
      formData.duration &&
      formData.riskRewardRatio &&
      formData.script &&
      formData.expire &&
      formData.strike_price &&
      formData.position_status
    );
  };

  const CustomDropdown = ({
    label,
    value,
    options,
    dropdownName,
    placeholder = "Select an option",
    onSelect,
    loading = false
  }) => {
    const isOpen = activeDropdown === dropdownName;
    const localRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (localRef.current && !localRef.current.contains(event.target)) {
          setActiveDropdown(prev => (prev === dropdownName ? null : prev));
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [dropdownName]);

    return (
      <div className="relative" ref={localRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div
          className={`w-full p-3 bg-white border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${value ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400'
            } ${isOpen ? 'border-gray-300' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={() => !loading && toggleDropdown(dropdownName)}
        >
          <span className={`${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {loading ? 'Loading...' : (value || placeholder)}
          </span>
          {!loading && (
            <span className="text-gray-500">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          )}
        </div>

        {isOpen && !loading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {(!options || options.length === 0) ? (
              <div className="p-3 text-gray-500 text-sm text-center">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const optionValue = typeof option === 'object'
                  ? (option.name || option.planName || option.title || option.label || option)
                  : option;
                const optionKey = typeof option === 'object'
                  ? (option.id || option._id || option.slug || option.name || index)
                  : option || index;
                const optionDescription = typeof option === 'object'
                  ? (option.description || option.desc || '')
                  : '';

                return (
                  <div
                    key={optionKey}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${value === optionValue ? 'bg-blue-50' : ''
                      }`}
                    onClick={() =>
                      onSelect(
                        dropdownName,
                        optionValue,
                        typeof option === 'object' ? option.id : null
                      )
                    }

                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${value === optionValue ? 'text-blue-700' : 'text-gray-800'
                        }`}>
                        {optionValue}
                      </span>
                      {value === optionValue && (
                        <FiCheck className="text-green-500 text-lg" />
                      )}
                    </div>
                    {optionDescription && (
                      <span className="text-xs text-gray-500 mt-1 block">
                        {optionDescription}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  };

  const handlePriceSubmit = async (priceData) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...parentData,
        ...priceData,
        subscriptionPlan: selectedPlan || formData.subscriptionPlan,
        planId: selectedPlanId,
        userId: userId,
      };

      const res = await fetch(`${apiUrl}/signals/create-signal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Error creating signal');
        return;
      }

      const result = await res.json();
      console.log('Signal saved:', result);

      if (onSignalCreated) {
        onSignalCreated(result);
      }

      toast.success('Signal created successfully!');
      setShowPriceModal(false);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('❌ No userId found');
      return;
    }

    console.log('🔄 Fetching plans for userId:', userId);

    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        console.log('🌐 API URL:', `${apiUrl}/plans/get-plan-name/${userId}`);

        const res = await axios.get(`${apiUrl}/plans/get-plan-name/${userId}`);
        console.log('✅ Raw API Response:', res.data);

        let formattedPlans = [];

        if (res.data && typeof res.data === 'object') {
          if (Array.isArray(res.data)) {
            formattedPlans = res.data.map((plan, index) => ({
              id: plan.id || plan._id || plan.slug || `plan-${index}`,
              name: plan.name || plan.planName || plan.title || `Plan ${index + 1}`,
              description: plan.description || plan.desc || ''
            }));
          } else if (res.data.planName) {
            formattedPlans = [{
              id: 'user-plan',
              name: res.data.planName,
              description: ''
            }];
          }
        }

        console.log('✅ Formatted Plans:', formattedPlans);
        setPlanOptions(formattedPlans);

        if (formattedPlans.length === 1 && !selectedPlan) {
          handleSelect(
            'subscriptionPlan',
            formattedPlans[0].name,
            formattedPlans[0].id
          );
        }

      } catch (error) {
        console.error("❌ Error fetching plans:", error.response?.data || error.message);
        setPlanOptions([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [userId, apiUrl, selectedPlan]);

  return (
    <>
      {!showPriceModal ? (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800">Create Signal</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleNext}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Segment"
                  value={formData.segment}
                  options={segments}
                  dropdownName="segment"
                  placeholder="Select Segment"
                  onSelect={handleSelect}
                />
                <CustomDropdown
                  label="Instrument"
                  value={formData.instrument}
                  options={instrument}
                  dropdownName="instrument"
                  placeholder="Select instrument"
                  onSelect={handleSelect}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">Script</label>
                  <input
                    type="text"
                    name="script"
                    value={formData.script}
                    onChange={handleInputChange}
                    placeholder="HINDUNILVR"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2">Expire</label>
                  <input
                    type="text"
                    name="expire"
                    value={formData.expire}
                    onChange={handleInputChange}
                    placeholder="30DEC2025"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>
              {/* Grid layouts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Instrument Type"
                  value={formData.instrumentType}
                  options={instrumentTypes}
                  dropdownName="instrumentType"
                  placeholder="Select Type"
                  onSelect={handleSelect}
                />
                {/* <CustomDropdown
                  label="Trade Direction"
                  value={formData.tradeDirection}
                  options={tradeDirections}
                  dropdownName="tradeDirection"
                  placeholder="Select Direction"
                  onSelect={handleSelect}
                /> */}

                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2">Strike Price</label>
                  <input
                    type="text"
                    name="strike_price"
                    value={formData.strike_price}
                    onChange={handleInputChange}
                    placeholder="2400"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <CustomDropdown
                  label="Trade Direction"
                  value={formData.tradeDirection}
                  options={tradeDirections}
                  dropdownName="tradeDirection"
                  placeholder="Select Direction"
                  onSelect={handleSelect}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Reward Ratio</label>
                  <input
                    type="text"
                    name="riskRewardRatio"
                    value={formData.riskRewardRatio}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 : 6.7"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <CustomDropdown
                  label="Position Status"
                  value={formData.position_status}
                  options={position_status}
                  dropdownName="position_status"
                  placeholder="Select position_status"
                  onSelect={handleSelect}
                />
                <CustomDropdown
                  label="Duration"
                  value={formData.duration}
                  options={durations}
                  dropdownName="duration"
                  placeholder="Select Duration"
                  onSelect={handleSelect}
                />

              </div>

              {/* Subscription Plan Dropdown */}
              <div>
                <CustomDropdown
                  label="Subscription Plan *"
                  value={selectedPlan || formData.subscriptionPlan}
                  options={planOptions}
                  dropdownName="subscriptionPlan"
                  placeholder={
                    loadingPlans
                      ? "Loading plans..."
                      : (planOptions.length === 0 ? "No plans found" : "Select a subscription plan")
                  }
                  loading={loadingPlans}
                  onSelect={handleSelect}
                />

                {loadingPlans && (
                  <p className="mt-1 text-xs text-blue-500 animate-pulse">Loading plans...</p>
                )}
                {!loadingPlans && planOptions.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">No subscription plans found for this user</p>
                )}
                {!loadingPlans && planOptions.length > 0 && !selectedPlan && !formData.subscriptionPlan && (
                  <p className="mt-1 text-xs text-orange-500">Please select a subscription plan</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <PriceLevels
              onClose={() => setShowPriceModal(false)}
              onSubmit={handlePriceSubmit}
              data={null}
              parentData={parentData}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSignal;