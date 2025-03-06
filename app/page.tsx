"use client";

import { useState } from "react";

type Meal = {
  price: string;
};

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([{ price: "" }]);
  const [tax, setTax] = useState(10);
  const [tip, setTip] = useState(15);
  const [tipType, setTipType] = useState<"percentage" | "cash">("percentage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // state to track edit mode

  const handleMealChange = (index: number, value: string) => {
    const updatedMeals = [...meals];
    updatedMeals[index].price = value;
    setMeals(updatedMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { price: "" }]);
  };

  const deleteMeal = (index: number) => {
    if (meals.length > 1) {
      const updatedMeals = meals.filter((_, idx) => idx !== index);
      setMeals(updatedMeals);
    }
  };

  const totalBeforeTax = meals.reduce(
    (acc, meal) => acc + (parseFloat(meal.price) || 0),
    0
  );

  const totalTaxAmount = (totalBeforeTax * (tax || 0)) / 100;
  let totalTipAmount = 0;

  if (tipType === "percentage") {
    totalTipAmount = (totalBeforeTax * (tip || 0)) / 100;
  } else if (tipType === "cash") {
    totalTipAmount = tip || 0;
  }

  const totalWithTaxAndTip = totalBeforeTax + totalTaxAmount + totalTipAmount;

  const mealTips = meals.map((meal) => {
    const mealPrice = parseFloat(meal.price) || 0;
    const mealPercentage = mealPrice / totalBeforeTax;
    return mealPercentage * totalTipAmount;
  });

  const handleReset = () => {
    setMeals([{ price: "" }]);
    setTax(10);
    setTip(15);
    setTipType("percentage");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-amber-100 text-black">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        the greatest bill splitter of all time v1 alpha version if you want
        anything or see anything break please hit me
      </h1>
      <div className="w-full max-w-sm space-y-3 relative">
        <div className="mb-20">
          {/* Reset Button at top left */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 left-4 w-16 h-10 flex items-center justify-center bg-blue-300 rounded-full font-semibold hover:bg-blue-400 focus:outline-none text-white"
          >
            Reset
          </button>

          {/* Edit Button at top right */}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="absolute top-4 right-4 w-16 h-10 flex items-center justify-center bg-purple-300 rounded-full font-semibold hover:bg-purple-400  text-white"
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>

        {meals.map((meal, index) => {
          const price = parseFloat(meal.price) || 0;
          const taxAmount = (price * (tax || 0)) / 100;
          let mealTipAmount = 0;

          if (tipType === "percentage") {
            mealTipAmount = (price * (tip || 0)) / 100;
          } else if (tipType === "cash") {
            mealTipAmount = mealTips[index] || 0;
          }

          const totalMealCost = price + taxAmount + mealTipAmount;

          return (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-opacity-20 flex justify-between relative"
            >
              <div className="w-full">
                <input
                  type="number"
                  placeholder="Meal price"
                  value={meal.price}
                  onChange={(e) => handleMealChange(index, e.target.value)}
                  className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent text-black"
                />
                <p className="text-sm">meal: ${price.toFixed(2)}</p>
                <p className="text-sm">
                  tax ({tax}%): ${taxAmount.toFixed(2)}
                </p>
                <p className="text-sm">
                  tip ({tipType === "percentage" ? `${tip}%` : `$${tip}`}) : $
                  {mealTipAmount.toFixed(2)}
                </p>
                <p className="font-bold text-sm">
                  total: ${totalMealCost.toFixed(2)}
                </p>
              </div>

              {/* Subtract button (same style as Add) */}
              {isEditing && meals.length > 1 && (
                <button
                  onClick={() => deleteMeal(index)}
                  className="w-10 h-10 flex items-center justify-center bg-red-300 rounded-full font-semibold hover:bg-red-400 focus:outline-none  text-white ml-2"
                >
                  -
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={addMeal}
          className="w-10 h-10 flex items-center justify-center bg-green-500 rounded-full font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 mx-auto text-white"
        >
          +
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="tax" className="w-20 text-sm font-semibold">
            tax %
          </label>
          <input
            id="tax"
            type="number"
            value={tax === 0 ? "" : tax}
            onChange={(e) => {
              const value = e.target.value;
              setTax(
                value === "" || parseFloat(value) < 0 ? 0 : parseFloat(value)
              );
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
            placeholder="Tax %"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="tipType" className="w-20 text-sm font-semibold">
            tip type
          </label>
          <select
            id="tipType"
            value={tipType}
            onChange={(e) =>
              setTipType(e.target.value as "percentage" | "cash")
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
          >
            <option value="percentage">Percentage</option>
            <option value="cash">Cash Value</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="tip" className="w-20 text-sm font-semibold">
            tip {tipType === "percentage" ? "%" : "$"}
          </label>
          <input
            id="tip"
            type="number"
            value={tipType === "cash" ? tip : tip === 0 ? "" : tip}
            onChange={(e) => {
              const value = e.target.value;
              setTip(
                value === "" || parseFloat(value) < 0 ? 0 : parseFloat(value)
              );
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black bg-transparent"
            placeholder={tipType === "percentage" ? "Tip %" : "Cash Value"}
          />
        </div>

        <div className="mt-4 p-4 border rounded-lg shadow-sm bg-opacity-20">
          <p>
            <strong>total before tax:</strong> ${totalBeforeTax.toFixed(2)}
          </p>
          <p>
            <strong>total tax:</strong> ${totalTaxAmount.toFixed(2)}
          </p>
          <p>
            <strong>total tip:</strong> ${totalTipAmount.toFixed(2)}
          </p>
          <p className="font-bold text-lg">
            grand total: ${totalWithTaxAndTip.toFixed(2)}
          </p>
          <p>
            have you ever struggled to properly split the bill but never wanted
            to dtm. introducing the tgbsoat. go ahead man{" "}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center backdrop-blur-xs justify-center">
          <div className="bg-white p-6 rounded-lg  shadow-lg">
            <h2 className="text-xl font-semibold mb-4">hang on now</h2>
            <p>do you really want to reset all the stuff</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-green-300 text-white rounded hover:bg-green-400"
              >
                yessss
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-pink-300 text-white rounded hover:bg-pink-400"
              >
                nooooo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
