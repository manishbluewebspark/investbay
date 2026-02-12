import { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiSearch,
  FiX
} from 'react-icons/fi';
import EditPriceLevels from './EditPriceLevels';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditSignal = ({ data, onNext, onClose, onSignalUpdated }) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scrip master related states
  const [scripMasterData, setScripMasterData] = useState([]);
  const [loadingScrips, setLoadingScrips] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScriptDropdownOpen, setIsScriptDropdownOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user).id;

  const [planOptions, setPlanOptions] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [formData, setFormData] = useState({
    segment: '',
    instrument: '',
    script: '',
    scriptToken: '',
    scriptName: '',
    expiry: '',
    instrumentType: '',
    strike_price: '',
    tradeDirection: '',
    exchange: '',
    duration: '',
    riskRewardRatio: '',
    position_status: '',
    subscriptionPlan: ''
  });

  // Initialize form with existing data
  useEffect(() => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        ...data
      }));
      if (data.subscriptionPlan) {
        setSelectedPlan(data.subscriptionPlan);
      }
    }
  }, [data]);

  // Fetch scrip master data on component mount
  useEffect(() => {
    fetchScripMasterData();
  }, []);

  const fetchScripMasterData = async () => {
    try {
      setLoadingScrips(true);
      const response = await axios.get(
        'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json'
      );
      
      // Add unique IDs and format data
      const formattedScrips = response.data.map((scrip, index) => ({
        ...scrip,
        id: scrip.token || `scrip-${index}`
      }));
      
      setScripMasterData(formattedScrips);
    } catch (error) {
      console.error('Error fetching scrip master data:', error);
      // Fallback sample data
      setScripMasterData([
        {"token":"99926000","symbol":"Nifty 50","name":"NIFTY","expiry":"","strike":"0.000000","lotsize":"1","instrumenttype":"AMXIDX","exch_seg":"NSE","tick_size":"0.000000"},
        {"token":"99926009","symbol":"Nifty Bank","name":"BANKNIFTY","expiry":"30DEC2025","strike":"0.000000","lotsize":"1","instrumenttype":"OPTIDX","exch_seg":"NSE","tick_size":"0.05"},
        {"token":"99926008","symbol":"Nifty IT","name":"NIFTY IT","expiry":"","strike":"0.000000","lotsize":"1","instrumenttype":"FUTIDX","exch_seg":"NSE","tick_size":"0.05"},
        {"token":"12345678","symbol":"RELIANCE","name":"RELIANCE INDUSTRIES LTD","expiry":"","strike":"0.000000","lotsize":"1","instrumenttype":"EQ","exch_seg":"NSE","tick_size":"0.05"},
        {"token":"87654321","symbol":"TCS","name":"TATA CONSULTANCY SERVICES LTD","expiry":"","strike":"0.000000","lotsize":"1","instrumenttype":"EQ","exch_seg":"NSE","tick_size":"0.05"},
        {"token":"55555555","symbol":"BANKNIFTY 30DEC2025 50000 CE","name":"BANKNIFTY","expiry":"30DEC2025","strike":"50000","lotsize":"25","instrumenttype":"CE","exch_seg":"NSE","tick_size":"0.05"},
        {"token":"66666666","symbol":"BANKNIFTY 30DEC2025 50000 PE","name":"BANKNIFTY","expiry":"30DEC2025","strike":"50000","lotsize":"25","instrumenttype":"PE","exch_seg":"NSE","tick_size":"0.05"}
      ]);
    } finally {
      setLoadingScrips(false);
    }
  };

  // Filter scrips based on search query
  const filteredScrips = useMemo(() => {
    if (!searchQuery.trim()) {
      return scripMasterData.slice(0, 100);
    }

    const query = searchQuery.toLowerCase();
    return scripMasterData.filter(scrip => 
      scrip.symbol.toLowerCase().includes(query) ||
      scrip.name.toLowerCase().includes(query) ||
      scrip.token.includes(query)
    ).slice(0, 50);
  }, [searchQuery, scripMasterData]);

  // Map instrument types from Angel Broking to your format
  const mapInstrumentType = (angelType) => {
    const typeMap = {
      'EQ': 'EQ',
      'CE': 'CE',
      'PE': 'PE',
      'FUTIDX': 'FUT',
      'FUTSTK': 'FUT',
      'OPTIDX': 'CE/PE',
      'OPTSTK': 'CE/PE',
      'AMXIDX': 'Index',
      'FUTCUR': 'FUT'
    };
    return typeMap[angelType] || angelType;
  };

  // Map instrument category
  const mapInstrumentCategory = (angelType) => {
    const categoryMap = {
      'EQ': 'Stock',
      'AMXIDX': 'Index',
      'FUTIDX': 'Future',
      'FUTSTK': 'Future',
      'OPTIDX': 'Option',
      'OPTSTK': 'Option',
      'CE': 'Option',
      'PE': 'Option'
    };
    return categoryMap[angelType] || 'Stock';
  };

  // Map segment based on instrument type
  const mapSegment = (angelType) => {
    const segmentMap = {
      'EQ': 'Equity',
      'CE': 'Options',
      'PE': 'Options',
      'FUTIDX': 'F&O',
      'FUTSTK': 'F&O',
      'OPTIDX': 'Options',
      'OPTSTK': 'Options',
      'AMXIDX': 'F&O',
      'FUTCUR': 'F&O'
    };
    return segmentMap[angelType] || 'Equity';
  };

  // Handle script selection with auto-fill
  const handleScriptSelect = (scrip) => {
    const mappedData = {
      script: scrip.symbol,
      scriptToken: scrip.token,
      scriptName: scrip.name,
      exchange: scrip.exch_seg || 'NSE',
      instrumentType: mapInstrumentType(scrip.instrumenttype),
      instrument: mapInstrumentCategory(scrip.instrumenttype),
      segment: mapSegment(scrip.instrumenttype)
    };

    if (scrip.expiry && scrip.expiry.trim() !== '') {
      mappedData.expiry = scrip.expiry;
    }

    if (scrip.strike && scrip.strike !== '0.000000') {
      mappedData.strike_price = parseFloat(scrip.strike).toString();
    }

    setFormData(prev => ({
      ...prev,
      ...mappedData
    }));

    toast.success(`Selected: ${scrip.symbol}`, {
      position: "top-center",
      autoClose: 2000,
    });

    setIsScriptDropdownOpen(false);
    setSearchQuery('');
  };

  const instrumentTypes = ['CE', 'PE', 'FUT', 'EQ'];
  const tradeDirections = ['BUY', 'SELL'];
  const segments = ['Options', 'F&O', 'Equity'];
  const instrumentCategories = ['Index', 'Stock', 'Future', 'Option'];
  const position_status = ['Active', 'Inactive'];
  const exchanges = ['NSE', 'BSE', 'MCX'];
  const durations = ['Intraday', 'BTST/STBT', '0-7 Days', '1-4 Weeks', '1 Month'];

  const toggleDropdown = (dropdownName) => {
    if (dropdownName === 'script') {
      setIsScriptDropdownOpen(!isScriptDropdownOpen);
    } else {
      setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
    }
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

    if (field === 'script') {
      setIsScriptDropdownOpen(false);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'script') {
      setSearchQuery(value);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    // For edit mode, we don't need strict validation
    // Just check for basic required fields
    if (!formData.script) {
      toast.error("Please select a script/symbol");
      return;
    }

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

  // Relaxed validation for edit mode
  const isFormValid = () => {
    // For edit mode, only script is required
    // All other fields can be optional
    return formData.script && formData.script.trim() !== '';
  };

  const SearchableScriptDropdown = () => {
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsScriptDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isScriptDropdownOpen && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, [isScriptDropdownOpen]);

    return (
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Script/Symbol *
          {formData.scriptToken && (
            <span className="ml-2 text-xs text-green-600">
              Token: {formData.scriptToken}
            </span>
          )}
        </label>
        
        <div
          className={`w-full p-3 bg-white border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${formData.script ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400'} ${isScriptDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
          onClick={() => setIsScriptDropdownOpen(true)}
        >
          <div className="flex items-center gap-2 flex-1">
            <FiSearch className="text-gray-400" />
            <span className={formData.script ? 'text-gray-800' : 'text-gray-400'}>
              {formData.script || 'Search or select instrument...'}
            </span>
          </div>
          <span className="text-gray-500">
            {isScriptDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>

        {formData.scriptName && (
          <p className="mt-1 text-xs text-gray-500">
            {formData.scriptName}
          </p>
        )}

        {isScriptDropdownOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiSearch />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by symbol, name or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loadingScrips && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading instruments...</p>
              </div>
            )}

            {/* Results List */}
            {!loadingScrips && (
              <div className="max-h-64 overflow-y-auto">
                {filteredScrips.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? 'No instruments found' : 'Type to search instruments'}
                  </div>
                ) : (
                  filteredScrips.map((scrip) => {
                    const mappedType = mapInstrumentType(scrip.instrumenttype);
                    const mappedSegment = mapSegment(scrip.instrumenttype);
                    
                    return (
                      <div
                        key={scrip.token}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${formData.script === scrip.symbol ? 'bg-blue-50' : ''}`}
                        onClick={() => handleScriptSelect(scrip)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-800">
                                {scrip.symbol}
                              </div>
                              {formData.script === scrip.symbol && (
                                <FiCheck className="text-green-500 text-sm" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {scrip.name}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {scrip.expiry && scrip.expiry.trim() !== '' && (
                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                  Exp: {scrip.expiry}
                                </span>
                              )}
                              {scrip.strike && scrip.strike !== '0.000000' && (
                                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                  Strike: {parseFloat(scrip.strike)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-gray-700">
                              {scrip.token}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 rounded">
                                {scrip.exch_seg}
                              </span>
                              <div className="mt-1 text-blue-600 font-medium">
                                {mappedType}
                              </div>
                              <div className="mt-1 text-green-600">
                                {mappedSegment}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Info Footer */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              {filteredScrips.length} instruments found • Select one to auto-fill
            </div>
          </div>
        )}
      </div>
    );
  };

  const CustomDropdown = ({
    label,
    value,
    options,
    dropdownName,
    placeholder = "Select an option",
    onSelect,
    loading = false,
    disabled = false,
    required = false // Add required prop
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
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div
          className={`w-full p-3 bg-white border rounded-lg flex justify-between items-center transition-colors ${value ? 'border-gray-300' : 'border-gray-300'} ${isOpen ? 'border-gray-300' : ''} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => !loading && !disabled && toggleDropdown(dropdownName)}
        >
          <span className={`${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {loading ? 'Loading...' : (value || placeholder)}
          </span>
          {!loading && !disabled && (
            <span className="text-gray-500">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          )}
        </div>

        {isOpen && !loading && !disabled && (
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

                return (
                  <div
                    key={optionKey}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${value === optionValue ? 'bg-blue-50' : ''}`}
                    onClick={() =>
                      onSelect(
                        dropdownName,
                        optionValue,
                        typeof option === 'object' ? option.id : null
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${value === optionValue ? 'text-blue-700' : 'text-gray-800'}`}>
                        {optionValue}
                      </span>
                      {value === optionValue && (
                        <FiCheck className="text-green-500 text-lg" />
                      )}
                    </div>
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

      // Use PUT request for update
      const res = await fetch(`${apiUrl}/signals/update-signal/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Error updating signal');
        return;
      }

      const result = await res.json();
      console.log('Signal updated:', result);

      if (onSignalUpdated) {
        onSignalUpdated(result);
      }

      toast.success('Signal updated successfully!');
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

    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await axios.get(`${apiUrl}/plans/get-plan-name/${userId}`);

        let formattedPlans = [];

        if (res.data && typeof res.data === 'object') {
          if (Array.isArray(res.data)) {
            formattedPlans = res.data.map((plan, index) => ({
              id: plan.id || plan._id || plan.slug || `plan-${index}`,
              name: plan.name || plan.planName || plan.title || `Plan ${index + 1}`,
            }));
          } else if (res.data.planName) {
            formattedPlans = [{
              id: 'user-plan',
              name: res.data.planName,
            }];
          }
        }

        setPlanOptions(formattedPlans);

        if (formattedPlans.length === 1 && !selectedPlan && !formData.subscriptionPlan) {
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
  }, [userId, apiUrl, selectedPlan, formData.subscriptionPlan]);

  return (
    <>
      {!showPriceModal ? (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300">
            <h1 className="text-2xl font-bold text-gray-800">Edit Signal</h1>
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiCheck className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">
                    Editing Signal ID: <strong>{data?.id}</strong>
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  * Only Script field is required for editing. All other fields are optional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Segment"
                  value={formData.segment}
                  options={segments}
                  dropdownName="segment"
                  placeholder="Select Segment (Optional)"
                  onSelect={handleSelect}
                />
                <CustomDropdown
                  label="Instrument Category"
                  value={formData.instrument}
                  options={instrumentCategories}
                  dropdownName="instrument"
                  placeholder="Select category (Optional)"
                  onSelect={handleSelect}
                />
              </div>

              {/* Searchable Script Dropdown */}
              <SearchableScriptDropdown />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">Expiry (Optional)</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="30DEC2025"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">Strike Price (Optional)</label>
                  <input
                    type="text"
                    name="strike_price"
                    value={formData.strike_price}
                    onChange={handleInputChange}
                    placeholder="2400"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Instrument Type (Optional)"
                  value={formData.instrumentType}
                  options={instrumentTypes}
                  dropdownName="instrumentType"
                  placeholder="Select Type (Optional)"
                  onSelect={handleSelect}
                />
                <CustomDropdown
                  label="Trade Direction (Optional)"
                  value={formData.tradeDirection}
                  options={tradeDirections}
                  dropdownName="tradeDirection"
                  placeholder="Select Direction (Optional)"
                  onSelect={handleSelect}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Exchange (Optional)"
                  value={formData.exchange}
                  options={exchanges}
                  dropdownName="exchange"
                  placeholder="Select Exchange (Optional)"
                  onSelect={handleSelect}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Reward Ratio (Optional)</label>
                  <input
                    type="text"
                    name="riskRewardRatio"
                    value={formData.riskRewardRatio}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 : 6.7"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  label="Position Status (Optional)"
                  value={formData.position_status}
                  options={position_status}
                  dropdownName="position_status"
                  placeholder="Select status (Optional)"
                  onSelect={handleSelect}
                />
                <CustomDropdown
                  label="Duration (Optional)"
                  value={formData.duration}
                  options={durations}
                  dropdownName="duration"
                  placeholder="Select Duration (Optional)"
                  onSelect={handleSelect}
                />
              </div>

              {/* Subscription Plan Dropdown */}
              <div>
                <CustomDropdown
                  label="Subscription Plan (Optional)"
                  value={selectedPlan || formData.subscriptionPlan}
                  options={planOptions}
                  dropdownName="subscriptionPlan"
                  placeholder={
                    loadingPlans
                      ? "Loading plans..."
                      : (planOptions.length === 0 ? "No plans found" : "Select a plan (Optional)")
                  }
                  loading={loadingPlans}
                  onSelect={handleSelect}
                />

                {loadingPlans && (
                  <p className="mt-1 text-xs text-blue-500 animate-pulse">Loading plans...</p>
                )}
                {!loadingPlans && planOptions.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">No subscription plans found</p>
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
                    <span>Updating...</span>
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
            <EditPriceLevels
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

export default EditSignal;