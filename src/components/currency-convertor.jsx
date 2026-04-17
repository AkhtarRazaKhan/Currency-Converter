import { useEffect, useState } from "react";
import CurrencyDropdown from "./currencyDropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState("");
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fav")) || ["USD", "INR", "EUR"];
    } catch {
      return ["USD", "INR", "EUR"];
    }
  });

  // Load currencies 
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        setCurrencies(Object.keys(data.rates || {}));
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  // Convert
  const convertCurrency = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);
    setConverted("");

    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );

      const data = await res.json();

      const rate = data?.rates?.[toCurrency];

      if (!rate) throw new Error("Invalid rate");

      const result = (amount * rate).toFixed(2);

      setConverted(`${result} ${toCurrency}`);
    } catch (err) {
      setConverted("Conversion failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // toggle favorite
  const toggleFavorite = (cur) => {
    let updated = [...favorites];

    if (updated.includes(cur)) {
      updated = updated.filter((c) => c !== cur);
    } else {
      updated.push(cur);
    }

    setFavorites(updated);
    localStorage.setItem("fav", JSON.stringify(updated));
  };

  //  swap
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConverted("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Currency Converter 
        </h1>

        {/* DROPDOWNS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">

          <CurrencyDropdown
            label="From"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            currencies={currencies}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />

          {/* SWAP */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-4 rounded-full bg-indigo-50 hover:bg-indigo-100 transition"
            >
              <HiArrowsRightLeft className="text-2xl text-indigo-600" />
            </button>
          </div>

          <CurrencyDropdown
            label="To"
            currency={toCurrency}
            setCurrency={setToCurrency}
            currencies={currencies}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </div>

        {/* AMOUNT */}
        <div className="mt-8 w-full">
          <label className="text-sm text-gray-600 font-medium">
            Enter Amount
          </label>

          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={convertCurrency}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? "Converting..." : "Convert Currency"}
        </button>

        {/* RESULT */}
        {converted && (
          <div className="mt-6 text-center text-2xl font-bold text-green-600">
            {converted}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
