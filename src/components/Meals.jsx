import { useEffect, useState } from "react";
import MealItem from "./MealItem.jsx";
import useHttpCustom from "../hooks/useHttpCustom.js";
import Error from "./Error.jsx";

const configRequest = {};

export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttpCustom("http://localhost:4000/meals", configRequest, []);

  // if (!loadedMeals) {
  //   return <p>No meals found.</p>;
  // }

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  if (error) {
    return <Error title=" failed fetching meal data" message={error} />;
  }

  // const [loadedMeals, setLoadedMeals] = useState([]);
  // useEffect(() => {
  //   async function fetchMeals() {
  //     const response = await fetch("http://localhost:4000/meals");

  //     if (!response.ok) {
  //       return;
  //     }

  //     const meals = await response.json();
  //     setLoadedMeals(meals);
  //   }

  //   fetchMeals();
  // }, []);

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        // <li key={meal.id}>{meal.name}</li>
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
