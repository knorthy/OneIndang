import axios from 'axios';

// ⚠️ SECURITY WARNING: Move these to environment variables!
// Create a .env file and use expo-constants or react-native-dotenv
// Example: EXPO_PUBLIC_PLACES_API_KEY in .env
export const PLACES_API_KEY = process.env.EXPO_PUBLIC_PLACES_API_KEY || 'AIzaSyC9Rlh2lJUrPJKkK8hBhyXIl_xlZkXxm8s';
const DIRECTIONS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY || 'AIzaSyCOLL_G8QOrG8KWcBZA7H2WHsACGQmlRR8';

// API FUNCTION: Uses ROUTES API
export const fetchRouteDetails = async (origin, destination) => {
  // Improved validation
  if (!origin || !destination) {
    throw new Error('Please select a valid starting point and destination.');
  }

  // Validate that origin and destination have required properties
  if (typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
    throw new Error('Invalid origin coordinates. Please select a valid starting point.');
  }

  if (typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
    throw new Error('Invalid destination coordinates. Please select a valid destination.');
  }

  try {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng
          }
        }
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE_OPTIMAL",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "en-US",
      units: "METRIC"
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': DIRECTIONS_API_KEY,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
      }
    });

    console.log('Routes API Response:', response.data);

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const distMeters = route.distanceMeters;
      const distKm = (distMeters / 1000).toFixed(2);

      // Improved duration parsing with fallback
      let durationSeconds = 0;
      if (route.duration) {
        // Handle both "123s" string format and numeric values
        if (typeof route.duration === 'string') {
          durationSeconds = parseInt(route.duration.replace('s', ''), 10) || 0;
        } else if (typeof route.duration === 'number') {
          durationSeconds = route.duration;
        }
      }

      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);

      let durationText = '';
      if (hours > 0) {
        durationText += `${hours} hour${hours > 1 ? 's' : ''} `;
      }
      if (minutes > 0) {
        durationText += `${minutes} min${minutes > 1 ? 's' : ''}`;
      }
      if (hours === 0 && minutes === 0) {
        durationText = durationSeconds > 0 ? `${durationSeconds} seconds` : 'Less than a minute';
      }

      return {
        distance: distKm,
        duration: durationText.trim(),
        distValue: parseFloat(distKm)
      };
    } else {
      throw new Error('No route found between these locations.');
    }
  } catch (error) {
    console.error("API Error: ", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      let errorMessage = 'Unable to find a route between these locations.';
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// --- INDANG SPECIFIC FARE LOGIC ---
export const calculateFare = async (selectedTransport, tricycleType, passengerCount, isDiscounted, origin, destination) => {
  if (!selectedTransport) {
    throw new Error('Please select a vehicle type first.');
  }

  // Validate passenger count
  const validPassengerCount = Math.max(1, Math.min(6, parseInt(passengerCount, 10) || 1));

  // 1. Get Distance from API
  const routeDetails = await fetchRouteDetails(origin, destination);
  const distKm = routeDetails.distValue;

  // Helper function to check if destination is within Indang area (before Trece Martires)
  const isIndangAreaDestination = (destDesc) => {
    if (!destDesc) return false;
    const indangPlaces = ['buna cerca', 'kaytapos', 'alulod', 'mahabang kahoy', 'regina', 'indang'];
    return indangPlaces.some(place => destDesc.toLowerCase().includes(place));
  };

  // Helper function to check specific tricycle special routes
  const getTricycleSpecialFare = (originDesc, destDesc) => {
    if (!originDesc || !destDesc) return null;

    const originLower = originDesc.toLowerCase();
    const destLower = destDesc.toLowerCase();

    // Indang to Buna Cerca
    if (originLower.includes('indang') && destLower.includes('buna cerca')) return 30;
    // Katpaos to Buna
    if (originLower.includes('katpaos') && destLower.includes('buna')) return 30;
    // CVSU to Buna Cerca
    if (originLower.includes('cvsu') && destLower.includes('buna cerca')) return 30;

    return null; // No special fare
  };

  // Helper function to round to nearest multiple of 5
  const roundToNearestFive = (num) => {
    return Math.round(num / 5) * 5;
  };

  let finalFare = 0;

  // 2. Apply Rules
  if (selectedTransport === 'Tricycle') {
    if (tricycleType === 'Regular') {
      // Flat 20 pesos per person regardless of distance (within town)
      finalFare = 20 * validPassengerCount;
    } else {
      // Check for special routes first
      const specialFare = getTricycleSpecialFare(origin?.desc, destination?.desc);
      if (specialFare !== null) {
        finalFare = specialFare;
      } else {
        // Special: 30 base + 5 per km in excess of 3km
        let base = 30;
        if (distKm > 3) {
          const excess = distKm - 3;
          base += (excess * 5);
        }
        finalFare = base;
      }
    }
    // Round tricycle fares to nearest multiple of 5
    finalFare = roundToNearestFive(finalFare);
  }
  else if (selectedTransport === 'Bus') {
    // Check if destination is within Indang area (before Trece Martires City)
    if (isIndangAreaDestination(destination?.desc)) {
      // Flat 20 pesos regardless of discount for Indang area destinations
      finalFare = 20;
    } else {
      // Regular fare calculation for destinations outside Indang area
      if (distKm <= 15) {
        finalFare = 20;
      } else if (distKm <= 28) {
        // Long Range (> 15km to 28km): Scale from 20 to 45
        const slope = 25 / 13; // (45 - 20) / (28 - 15)
        const excess = distKm - 15;
        finalFare = 20 + (excess * slope);
      } else {
        // Cap at 45 for distances > 28km (or adjust as needed)
        finalFare = 45;
      }

      // Apply Discount only for destinations outside Indang area
      if (isDiscounted) finalFare = finalFare * 0.80;
    }
  }
  else if (selectedTransport === 'Jeep') {
    // Minimum (<= 4km): 13 pesos
    if (distKm <= 4) {
      finalFare = 13;
    }
    // Medium (4km < dist <= 15km): Scale 13 to 20
    else if (distKm <= 15) {
      const slope = 7 / 11; // (20 - 13) / (15 - 4)
      const excess = distKm - 4;
      finalFare = 13 + (excess * slope);
    }
    // Long (15km < dist <= 28km): Scale 20 to 40
    else if (distKm <= 28) {
      const slope = 20 / 13; // (40 - 20) / (28 - 15)
      const excess = distKm - 15;
      finalFare = 20 + (excess * slope);
    } else {
      // Cap at 40 for distances > 28km (or adjust as needed)
      finalFare = 40;
    }

    // Apply Discount
    if (isDiscounted) finalFare = finalFare * 0.80;
  }
  else if (selectedTransport === 'Personal Car') {
    // No fare for personal car, just return route info
    return {
      fare: '0.00',
      distance: routeDetails.distance,
      duration: routeDetails.duration
    };
  }

  return {
    fare: Math.ceil(finalFare).toFixed(2),
    distance: routeDetails.distance,
    duration: routeDetails.duration
  };
};

// --- GOOGLE MAPS URL GENERATION ---
export const getGoogleMapsUrl = (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Please enter start and destination points.');
  }

  // Validate coordinates
  if (typeof origin.lat !== 'number' || typeof origin.lng !== 'number' ||
      typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
    throw new Error('Invalid coordinates. Please select valid locations.');
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  return url;
};