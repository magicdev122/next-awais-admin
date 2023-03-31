import "tailwindcss/tailwind.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";


const DateRangeFilter = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date:any) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date:any) => {
    setEndDate(date);
  };

  const handleFilterClick = () => {
    console.log(`Filter clicked with start date ${startDate} and end date ${endDate}`);
  };

  return (
    <div className="flex space-x-4">
      <div>
        <label htmlFor="start-date" className="block text-gray-700 font-bold mb-2">
          Start Date
        </label>
        <DatePicker
          id="start-date"
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-400 px-4 py-2 rounded-md w-full"
        />
      </div>
      <div>
        <label htmlFor="end-date" className="block text-gray-700 font-bold mb-2">
          End Date
        </label>
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-400 px-4 py-2 rounded-md w-full"
        />
      </div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
        onClick={handleFilterClick}
      >
        Filter
      </button>
    </div>
  );
};


  export default DateRangeFilter