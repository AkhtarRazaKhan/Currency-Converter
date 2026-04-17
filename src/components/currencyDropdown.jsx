import { FaStar } from "react-icons/fa";

const CurrencyDropdown = ({
  label,
  currency,
  setCurrency,
  currencies,
  favorites,
  toggleFavorite,
}) => {
  const isFavorite = favorites.includes(currency);

  return (
    <div className="w-full">

      {/* LABEL */}
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      {/* DROPDOWN WRAPPER */}
      <div className="relative mt-2 w-full">

        {/* SELECT */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 pr-10 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        >

          {/* FAVORITES FIRST */}
          {favorites.map((fav) => (
            <option key={fav} value={fav}>
               {fav}
            </option>
          ))}

          {/* REST CURRENCIES */}
          {currencies
            .filter((c) => !favorites.includes(c))
            .map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
        </select>

        {/*  STAR BUTTON */}
        <button
          type="button"
          onClick={() => toggleFavorite(currency)}
          className="absolute right-5 top-3 text-xl"
        >
          <FaStar
            className={
              isFavorite ? "text-yellow-400" : "text-gray-300"
            }
          />
        </button>

      </div>
    </div>
  );
};

export default CurrencyDropdown;
