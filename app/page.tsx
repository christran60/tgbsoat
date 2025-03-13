"use client";

import { useState, useEffect } from "react";
import ResetIcon from "@/public/assets/reset";
import EditIcon from "@/public/assets/edit";
import CheckmarkIcon from "@/public/assets/checkmark";
import ShareIcon from "@/public/assets/share";
import { Share } from "next/font/google";
type Meal = {
  price: string;
  name: string;
};

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([{ price: "", name: "" }]);
  const [tax, setTax] = useState(10);
  const [tip, setTip] = useState(15);
  const [tipType, setTipType] = useState<"percentage" | "cash">("percentage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // state to track edit mode
  // Function to encode state into a Base64 URL parameter
  const encodeStateToUrl = () => {
    const state = {
      meals,
      tax,
      tip,
      tipType,
    };
    const jsonState = JSON.stringify(state);
    const base64State = btoa(jsonState); // Convert to Base64
    return base64State;
  };

  // Function to decode state from a Base64 URL parameter
  const decodeStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const encodedState = params.get("s"); // 's' is the shortened param name for the state
    if (encodedState) {
      const decodedState = atob(encodedState); // Decode Base64
      const state = JSON.parse(decodedState);
      setMeals(state.meals);
      setTax(state.tax);
      setTip(state.tip);
      setTipType(state.tipType);
    }
  };

  useEffect(() => {
    // Decode the state from the URL when the component mounts
    decodeStateFromUrl();
  }, []);

  useEffect(() => {
    // Whenever meals, tax, tip, or tipType change, update the URL
    const newUrl = `${window.location.pathname}?s=${encodeStateToUrl()}`;
    window.history.replaceState({}, "", newUrl);
  }, [meals, tax, tip, tipType]);

  const handleMealChange = (
    index: number,
    field: "price" | "name",
    value: string
  ) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;
    setMeals(updatedMeals);
  };
  const addMeal = () => {
    setMeals([...meals, { price: "", name: "" }]);
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
    setMeals([{ price: "", name: "" }]);
    setTax(10);
    setTip(15);
    setTipType("percentage");
    setIsModalOpen(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this page!",
          url: window.location.href,
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Share failed", error);
      }
    } else {
      // Fallback for browsers that don't support the Share API
      const url = window.location.href;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy the link", error);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 sm:p-12 bg-slate-100 text-black font-domine">
      <h1 className="text-2xl mb-4 text-center">sixty°tgbsoat</h1>
      <div className="w-full max-w-sm space-y-3 relative">
        <div className="mb-4 flex justify-between">
          {/* Reset Button at top left */}
          <button
            onClick={() => setIsModalOpen(true)}
            className=" top-4 w-16 h-10 flex items-center justify-center font-semibold  focus:outline-none"
          >
            <ResetIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleShare}
            className=" top-4 w-16 h-10 flex items-center justify-center font-semibold  focus:outline-none"
          >
            <ShareIcon className="w-6 h-6" />
          </button>
          {/* Edit Button at top right */}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className=" top-4 w-16 h-10 flex items-center justify-center font-semibold"
          >
            {isEditing ? (
              <CheckmarkIcon className="w-6 h-6" />
            ) : (
              <EditIcon className="w-6 h-6" />
            )}
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
              className="flex justify-center flex-row items-center"
            >
              <div>
                {/* Render name input only when editing */}
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Meal name"
                    value={meal.name}
                    onChange={(e) =>
                      handleMealChange(index, "name", e.target.value)
                    }
                    className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
                  />
                ) : (
                  <p className="text-sm">{meal.name || `Meal #${index + 1}`}</p>
                )}
                <div className="p-4 rounded-xl shadow-lg bg-opacity-20 flex justify-between relative">
                  <div className="w-full">
                    <input
                      type="number"
                      placeholder="Meal price"
                      value={meal.price}
                      onChange={(e) =>
                        handleMealChange(index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent"
                    />
                    <p className="text-sm">meal: ${price.toFixed(2)}</p>
                    <p className="text-sm">
                      tax ({tax}%): ${taxAmount.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      tip ({tipType === "percentage" ? `${tip}%` : `$${tip}`}) :
                      ${mealTipAmount.toFixed(2)}
                    </p>
                    <p className="font-bold text-sm">
                      total: ${totalMealCost.toFixed(2)}
                    </p>
                  </div>
                </div>
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
          className="w-10 h-10 flex items-center justify-center bg-green-400 rounded-full font-semibold hover:bg-green-500  mx-auto text-white"
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
            className="w-1/2 p-2 border rounded  bg-transparent"
            placeholder={tipType === "percentage" ? "Tip %" : "Cash Value"}
          />
          <select
            id="tipType"
            value={tipType}
            onChange={(e) =>
              setTipType(e.target.value as "percentage" | "cash")
            }
            className=" p-2 border rounded focus:outline-none focus:ring-2 focus:ring-white bg-transparent w-1/2"
          >
            <option value="percentage">percentage</option>
            <option value="cash">cash value</option>
          </select>
        </div>

        <div className="mt-4 p-4 rounded-xl shadow-md bg-opacity-20">
          <div className="flex flex-col w-full text-center mb-8">
            <h1 className="text-xl">grand total</h1>
            <h2 className="text-2xl">${totalWithTaxAndTip.toFixed(2)}</h2>
          </div>
          <p>
            <strong>total before tax:</strong> ${totalBeforeTax.toFixed(2)}
          </p>
          <p>
            <strong>total tax:</strong> ${totalTaxAmount.toFixed(2)}
          </p>
          <p>
            <strong>total tip:</strong> ${totalTipAmount.toFixed(2)}
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
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
              >
                <CheckmarkIcon />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-300 text-white rounded hover:bg-red-400"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
