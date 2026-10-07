"use client";
import React from "react";
import { useEffect} from "react";
import Cards from './components/cards'
import SomeCard from './components/someCard'

export default function Home() {
  useEffect(() => {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=9d4617bda81f6e8751505b9c3091f3d5&units=metric')
      .then(res => res.json())
      .then(data => {
        console.log(data); 
        
      })
      .catch(err => console.error('Error fetching weather:', err));
  }, []);

  return(
    <>
    
    <div className="bg-gray-100 h-auto m-6 p-7">
      <Cards />
        <h2 className="text-2xl font-bold text-gray-700">Argicultural Tips</h2>
        <SomeCard />
    </div>
    </>
  );
}

