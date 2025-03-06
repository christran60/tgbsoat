"use client";

import { useState } from "react";

// Define the type for the meal object
type Meal = {
  price: string;
};

export default function Home() {
  // Specify the type for the meals state as an array of Meal objects
  const [meals, setMeals] = useState<Meal[]>([{ price: "" }]);
  const [tax, setTax] = useState(10); // Default 10% tax
  const [tip, setTip] = useState(15); // Default 15% tip
  const [tipType, setTipType] = useState<"percentage" | "cash">("percentage"); // Option to choose tip type

  const handleMealChange = (index: number, value: string) => {
    const updatedMeals = [...meals];
    updatedMeals[index].price = value;
    setMeals(updatedMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { price: "" }]);
  };

  const totalBeforeTax = meals.reduce(
    (acc, meal) => acc + (parseFloat(meal.price) || 0),
    0
  );

  // Calculate tax and tip, safely defaulting to 0 if they are null or empty
  const totalTaxAmount = (totalBeforeTax * (tax || 0)) / 100;
  let totalTipAmount = 0;

  if (tipType === "percentage") {
    totalTipAmount = (totalBeforeTax * (tip || 0)) / 100;
  } else if (tipType === "cash") {
    totalTipAmount = tip || 0; // Use the exact cash value if tip is set to cash
  }

  // Calculate the total meal cost with tax and tip
  const totalWithTaxAndTip = totalBeforeTax + totalTaxAmount + totalTipAmount;

  // Distribute the cash tip based on the percentage of each meal
  const mealTips = meals.map((meal) => {
    const mealPrice = parseFloat(meal.price) || 0;
    const mealPercentage = mealPrice / totalBeforeTax; // Percentage of the total price
    return mealPercentage * totalTipAmount; // Cash tip for each meal based on its percentage
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-amber-100 text-black">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        the greatest bill splitter of all time v1 alpha version if you want
        anything or see anything break please hit me
      </h1>
      <div className="w-full max-w-sm space-y-3">
        {meals.map((meal, index) => {
          const price = parseFloat(meal.price) || 0;
          const taxAmount = (price * (tax || 0)) / 100;
          let mealTipAmount = 0;

          if (tipType === "percentage") {
            mealTipAmount = (price * (tip || 0)) / 100;
          } else if (tipType === "cash") {
            mealTipAmount = mealTips[index] || 0; // Get the proportional cash tip for the meal
          }

          const totalMealCost = price + taxAmount + mealTipAmount;

          return (
            <div
              key={index}
              className="p-2 border rounded-lg shadow-sm bg-opacity-20"
            >
              <input
                type="number"
                placeholder="Meal price"
                value={meal.price}
                onChange={(e) => handleMealChange(index, e.target.value)}
                className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent text-black"
              />
              <p className="text-sm">Meal: ${price.toFixed(2)}</p>
              <p className="text-sm">
                Tax ({tax}%): ${taxAmount.toFixed(2)}
              </p>
              <p className="text-sm">
                Tip ({tipType === "percentage" ? `${tip}%` : `$${tip}`}) : $
                {mealTipAmount.toFixed(2)}
              </p>
              <p className="font-bold text-sm">
                Total: ${totalMealCost.toFixed(2)}
              </p>
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
            Tax %
          </label>
          <input
            id="tax"
            type="number"
            value={tax === 0 ? "" : tax} // Show empty string if tax is 0
            onChange={(e) => {
              const value = e.target.value;
              setTax(
                value === "" || parseFloat(value) < 0 ? 0 : parseFloat(value)
              ); // Prevent negative values
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
            placeholder="Tax %"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="tipType" className="w-20 text-sm font-semibold">
            Tip Type
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
            Tip {tipType === "percentage" ? "%" : "$"}
          </label>
          <input
            id="tip"
            type="number"
            value={tipType === "cash" ? tip : tip === 0 ? "" : tip} // Show empty string if tip is 0 in percentage mode
            onChange={(e) => {
              const value = e.target.value;
              setTip(
                value === "" || parseFloat(value) < 0 ? 0 : parseFloat(value)
              ); // Prevent negative values
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black bg-transparent"
            placeholder={tipType === "percentage" ? "Tip %" : "Cash Value"}
          />
        </div>

        <div className="mt-4 p-4 border rounded-lg shadow-sm bg-opacity-20">
          <p>
            <strong>Total Before Tax:</strong> ${totalBeforeTax.toFixed(2)}
          </p>
          <p>
            <strong>Total Tax:</strong> ${totalTaxAmount.toFixed(2)}
          </p>
          <p>
            <strong>Total Tip:</strong> ${totalTipAmount.toFixed(2)}
          </p>
          <p className="font-bold text-lg">
            Grand Total: ${totalWithTaxAndTip.toFixed(2)}
          </p>
          <div>
            have you ever struggled to properly split the bill but never wanted
            to dtm. introducing the tgbsoat. go ahead man{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
