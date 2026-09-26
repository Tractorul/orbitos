"use client";

import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";
import { getWMOInfo } from "@/lib/weather/wmoCodes";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, className = "w-6 h-6" }: WeatherIconProps) {
  const info = getWMOInfo(code, isDay);

  switch (info.iconName) {
    case "Sun":
      return <Sun className={className} />;
    case "Moon":
      return <Moon className={className} />;
    case "CloudSun":
      return <CloudSun className={className} />;
    case "CloudMoon":
      return <CloudMoon className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    case "CloudFog":
      return <CloudFog className={className} />;
    case "CloudDrizzle":
      return <CloudDrizzle className={className} />;
    case "CloudRain":
      return <CloudRain className={className} />;
    case "CloudSnow":
      return <CloudSnow className={className} />;
    case "CloudLightning":
      return <CloudLightning className={className} />;
    default:
      return <CloudSun className={className} />;
  }
}
