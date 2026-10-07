"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Cards() {
  const [weather, setWeather] = useState<any>();
  

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=9d4617bda81f6e8751505b9c3091f3d5&units=metric"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      });
  }, []);

  const today = new Date();
  const nextFiveDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  });

  return (
    <div>
      <div className="w-[400px] h-[230px] rounded-2xl shadow-2xl pt-8 mb-8 bg-white">
        {weather && weather.main && weather.sys && weather.weather ? (
          <>
            <h2 className="flex justify-center text-xl text-gray-950 font-bold">
              {weather.name}, {weather.sys.country}
              <Image
                src="/harVvl.png"
                alt="icon"
                width={30}
                height={30}
                className="ml-2"
              />
            </h2>
            <div className="py-4">
            <p className="flex justify-center font-bold text-4xl text-black">
              {weather.main.temp}°C
            </p>
            <p className="flex justify-center font-thin text-gray-400">
              {weather.weather[0].main}
            </p>
            </div>
            <p className="flex justify-center text-sm">
              Humidity: {weather.main.humidity}%
            </p>
            <p className="flex justify-center text-sm">
              Wind Speed: {weather.wind.speed} m/s
            </p>
          </>
        ) : (
          <p className="text-center">.</p>
        )}
      </div>

      <div className="flex py-8">
        {nextFiveDays.map((dateStr, index) => (
          <div key={index} className="w-[170px] h-[170px] rounded-2xl shadow-2xl bg-white p-8 m-2 ">
            <p className="flex justify-center font-bold">{dateStr}</p>
            <div className="flex justify-center ">
              <Image
                src="/tsenherVvl.png"
                alt="icon"
                width={25}
                height={25}
              />
            </div>
            {weather && weather.main ? (
              <>
                <p className="flex justify-center text-sm">
                  High: {weather.main.temp_max}°C
                </p>
                <p className="flex justify-center text-sm">
                  Low: {weather.main.temp_min}°C
                </p>
              </>
            ) : (
              <p >.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
