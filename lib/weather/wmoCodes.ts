export interface WMOInfo {
  code: number;
  description: string;
  iconName: "Sun" | "Moon" | "CloudSun" | "CloudMoon" | "Cloud" | "CloudFog" | "CloudDrizzle" | "CloudRain" | "CloudSnow" | "CloudLightning";
}

export function getWMOInfo(code: number, isDay: boolean = true): WMOInfo {
  switch (code) {
    case 0:
      return {
        code,
        description: isDay ? "Senin" : "Cer senin",
        iconName: isDay ? "Sun" : "Moon",
      };
    case 1:
      return {
        code,
        description: isDay ? "Predominant senin" : "Predominant senin",
        iconName: isDay ? "Sun" : "Moon",
      };
    case 2:
      return {
        code,
        description: "Parțial noros",
        iconName: isDay ? "CloudSun" : "CloudMoon",
      };
    case 3:
      return {
        code,
        description: "Înnorat",
        iconName: "Cloud",
      };
    case 45:
      return {
        code,
        description: "Ceață",
        iconName: "CloudFog",
      };
    case 48:
      return {
        code,
        description: "Ceață cu depunere de chiciură",
        iconName: "CloudFog",
      };
    case 51:
      return {
        code,
        description: "Burniță slabă",
        iconName: "CloudDrizzle",
      };
    case 53:
      return {
        code,
        description: "Burniță moderată",
        iconName: "CloudDrizzle",
      };
    case 55:
      return {
        code,
        description: "Burniță densă",
        iconName: "CloudDrizzle",
      };
    case 56:
    case 57:
      return {
        code,
        description: "Burniță înghețată",
        iconName: "CloudDrizzle",
      };
    case 61:
      return {
        code,
        description: "Ploaie slabă",
        iconName: "CloudRain",
      };
    case 63:
      return {
        code,
        description: "Ploaie moderată",
        iconName: "CloudRain",
      };
    case 65:
      return {
        code,
        description: "Ploaie torențială",
        iconName: "CloudRain",
      };
    case 66:
    case 67:
      return {
        code,
        description: "Ploaie înghețată",
        iconName: "CloudRain",
      };
    case 71:
      return {
        code,
        description: "Ninsoare slabă",
        iconName: "CloudSnow",
      };
    case 73:
      return {
        code,
        description: "Ninsoare moderată",
        iconName: "CloudSnow",
      };
    case 75:
      return {
        code,
        description: "Ninsoare abundentă",
        iconName: "CloudSnow",
      };
    case 77:
      return {
        code,
        description: "Grăunțe de zăpadă",
        iconName: "CloudSnow",
      };
    case 80:
      return {
        code,
        description: "Averse slabe de ploaie",
        iconName: "CloudRain",
      };
    case 81:
      return {
        code,
        description: "Averse de ploaie",
        iconName: "CloudRain",
      };
    case 82:
      return {
        code,
        description: "Averse torențiale",
        iconName: "CloudRain",
      };
    case 85:
      return {
        code,
        description: "Averse slabe de ninsoare",
        iconName: "CloudSnow",
      };
    case 86:
      return {
        code,
        description: "Averse puternice de ninsoare",
        iconName: "CloudSnow",
      };
    case 95:
      return {
        code,
        description: "Furtună cu descărcări electrice",
        iconName: "CloudLightning",
      };
    case 96:
    case 99:
      return {
        code,
        description: "Furtună cu grindină",
        iconName: "CloudLightning",
      };
    default:
      return {
        code,
        description: "Parțial noros",
        iconName: isDay ? "CloudSun" : "CloudMoon",
      };
  }
}
