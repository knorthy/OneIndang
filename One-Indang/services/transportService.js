import axios from 'axios';

// Google API Keys
export const PLACES_API_KEY = 'AIzaSyC9Rlh2lJUrPJKkK8hBhyXIl_xlZkXxm8s';
const DIRECTIONS_API_KEY = 'AIzaSyCOLL_G8QOrG8KWcBZA7H2WHsACGQmlRR8'; 

// API FUNCTION: Uses ROUTES API
export const fetchRouteDetails = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Please select a valid starting point and destination.');
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
      // --- FIX: Changed BEST_GUESS to TRAFFIC_AWARE ---
      routingPreference: "TRAFFIC_AWARE", 
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "en-US",
      units: "METRIC"
    };

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
      
      // Duration is in seconds, e.g., "123s"
      const durationSeconds = parseInt(route.duration.replace('s', ''));
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
        durationText = `${durationSeconds} seconds`;
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

  // 1. Get Distance from API
  const routeDetails = await fetchRouteDetails(origin, destination);
  const distKm = routeDetails.distValue;

  let finalFare = 0;

  // 2. Apply Rules
  if (selectedTransport === 'Tricycle') {
    if (tricycleType === 'Regular') {
      // Flat 20 pesos per person regardless of distance (within town)
      finalFare = 20 * passengerCount;
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
  else if (selectedTransport === 'Bus') {
    // Short Range (<= 15km): 20 pesos
    if (distKm <= 15) {
      finalFare = 20;
    } else {
      // Long Range (> 15km to 28km): Scale from 20 to 45
      // Slope (m) = (45 - 20) / (28 - 15) = 25 / 13 ≈ 1.92 pesos per km
      const slope = 1.923;
      const excess = distKm - 15;
      finalFare = 20 + (excess * slope);
    }

    // Apply Discount
    if (isDiscounted) finalFare = finalFare * 0.80;
  }
  else if (selectedTransport === 'Jeep') {
    // Minimum (<= 4km): 13 pesos
    if (distKm <= 4) {
      finalFare = 13;
    }
    // Medium (4km < dist <= 15km): Scale 13 to 20
    else if (distKm <= 15) {
      // Slope = (20 - 13) / (15 - 4) = 7 / 11 ≈ 0.636
      const slope = 0.636;
      const excess = distKm - 4;
      finalFare = 13 + (excess * slope);
    }
    // Long (15km < dist <= 28km): Scale 20 to 40
    else {
      // Slope = (40 - 20) / (28 - 15) = 20 / 13 ≈ 1.538
      const slope = 1.538;
      const excess = distKm - 15;
      finalFare = 20 + (excess * slope);
    }

    // Apply Discount
    if (isDiscounted) finalFare = finalFare * 0.80;
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

  // --- FIX: Corrected URL format for opening Google Maps App ---
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  return url;
};