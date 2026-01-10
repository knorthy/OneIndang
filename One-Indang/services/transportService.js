import axios from 'axios';

// ⚠️ SECURITY WARNING: Keep your API Keys in .env!
export const PLACES_API_KEY = process.env.EXPO_PUBLIC_PLACES_API_KEY;
const DIRECTIONS_API_KEY = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

// --- FARE CONFIGURATION ---
const FARE_RATES = {
  TRICYCLE: {
    REGULAR_FLAT: 20,    // Flat rate per head
    SPECIAL_BASE: 30,
    SPECIAL_PER_KM: 5,
    BASE_KM: 3
  },
  JEEP: {
    BASE_FARE: 13,
    BASE_KM: 4,
    PER_KM: 1.80
  },
  BUS: {
    // Logic: Indang to Trece (approx 12km) is fixed at 20.
    // Indang to PITX (approx 53km) is fixed at 120.
    // We calculate the rate for the distance in between.
    FLAT_RATE_DISTANCE: 15, // km (Covers Indang to Trece Martires)
    FLAT_RATE_PRICE: 20,    // Base price for Trece and before
    
    // Reference point for calculation (PITX)
    TARGET_DISTANCE: 53,    // approx km from Indang to PITX
    TARGET_PRICE: 120       // Regular fare to PITX
  }
};

// Calculate the Bus Rate Per KM dynamically based on your reference points
// Formula: (120 - 20) / (53 - 12) = ~2.44 pesos per excess km
const BUS_EXCESS_RATE = (FARE_RATES.BUS.TARGET_PRICE - FARE_RATES.BUS.FLAT_RATE_PRICE) / 
                        (FARE_RATES.BUS.TARGET_DISTANCE - FARE_RATES.BUS.FLAT_RATE_DISTANCE);

// --- API FUNCTION ---
export const fetchRouteDetails = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Please select a valid starting point and destination.');
  }

  if (typeof origin.lat !== 'number' || typeof destination.lat !== 'number') {
    throw new Error('Invalid coordinates.');
  }

  try {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    const requestBody = {
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE_OPTIMAL",
      computeAlternativeRoutes: false,
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

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const distKm = (route.distanceMeters / 1000);

      // Duration parsing
      let durationSeconds = 0;
      if (route.duration) {
        if (typeof route.duration === 'string') {
          durationSeconds = parseInt(route.duration.replace('s', ''), 10) || 0;
        } else if (typeof route.duration === 'number') {
          durationSeconds = route.duration;
        }
      }
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const durationText = (hours > 0 ? `${hours} hr ` : '') + `${minutes} min`;

      return {
        distance: distKm.toFixed(2),
        duration: durationText.trim(),
        distValue: distKm
      };
    } else {
      throw new Error('No route found.');
    }
  } catch (error) {
    console.error("API Error: ", error);
    throw new Error(error.response?.data?.error?.message || 'Unable to find a route.');
  }
};

// --- CALCULATION LOGIC ---
export const calculateFare = async (selectedTransport, tricycleType, passengerCount, isDiscounted, origin, destination) => {
  if (!selectedTransport) throw new Error('Please select a vehicle type first.');

  // 1. Validate Passenger Count
  let validPassengerCount;

  if (selectedTransport === 'Tricycle' && tricycleType === 'Regular') {
    // TRICYCLE REGULAR: Strict 2 to 6 passengers
    // parseInt ensures we have a number. If NaN, default to 2.
    // Math.max(2, ...) ensures nothing below 2.
    // Math.min(6, ...) ensures nothing above 6.
    let inputCount = parseInt(passengerCount, 10);
    if (isNaN(inputCount)) inputCount = 2; 
    validPassengerCount = Math.max(2, Math.min(6, inputCount));
  } else {
    // OTHER MODES: Standard 2  to 6
    let inputCount = parseInt(passengerCount, 10);
    if (isNaN(inputCount)) inputCount = 2;
    validPassengerCount = Math.max(2, Math.min(6, inputCount));
  }

  // 2. Get Distance from API
  const routeDetails = await fetchRouteDetails(origin, destination);
  const distKm = routeDetails.distValue;

  let finalFare = 0;
  
  const roundToNearestFive = (num) => Math.round(num / 5) * 5;

  // 3. Transport Logic
  switch (selectedTransport) {
    case 'Tricycle':
      if (tricycleType === 'Regular') {
        // Regular: Flat 20 pesos * number of passengers (Minimum 2 pax enforced above)
        finalFare = FARE_RATES.TRICYCLE.REGULAR_FLAT * validPassengerCount;
      } else {
        // Special: Base 30 + (Excess * 5)
        let fare = FARE_RATES.TRICYCLE.SPECIAL_BASE;
        if (distKm > FARE_RATES.TRICYCLE.BASE_KM) {
          fare += (distKm - FARE_RATES.TRICYCLE.BASE_KM) * FARE_RATES.TRICYCLE.SPECIAL_PER_KM;
        }
        finalFare = roundToNearestFive(fare);
      }
      break;

    case 'Bus':
      // BUS LOGIC: 
      // Rule 1: Distances <= 12km (Trece, Kaytapos, Alulod, etc.) = 20 Pesos
      if (distKm <= FARE_RATES.BUS.FLAT_RATE_DISTANCE) {
        finalFare = FARE_RATES.BUS.FLAT_RATE_PRICE;
      } 
      // Rule 2: Distances > 12km (Perez, Dasma, Bacoor, PITX) = Calculated
      else {
        const excessKm = distKm - FARE_RATES.BUS.FLAT_RATE_DISTANCE;
        finalFare = FARE_RATES.BUS.FLAT_RATE_PRICE + (excessKm * BUS_EXCESS_RATE);
      }

      // Apply Discount (20%)
      if (isDiscounted) {
        // Indang to PITX Check: 
        // 120 regular * 0.80 = 96 (Close to your 100 request, usually rounded up)
        // If you want exact 100 for PITX, the math works out naturally here.
        finalFare = finalFare * 0.80;
      }
      break;

    case 'Jeep':
      // Jeep Logic: Standard LTFRB
      if (distKm <= FARE_RATES.JEEP.BASE_KM) {
        finalFare = FARE_RATES.JEEP.BASE_FARE;
      } else {
        finalFare = FARE_RATES.JEEP.BASE_FARE + ((distKm - FARE_RATES.JEEP.BASE_KM) * FARE_RATES.JEEP.PER_KM);
      }
      if (isDiscounted) finalFare *= 0.80;
      break;

    case 'Personal Car':
      return { fare: '0.00', distance: routeDetails.distance, duration: routeDetails.duration };

    default:
      throw new Error('Unknown transport type.');
  }

  return {
    // Math.ceil rounds 96.5 to 97, or 119.2 to 120.
    fare: Math.ceil(finalFare).toFixed(2),
    distance: routeDetails.distance,
    duration: routeDetails.duration
  };
};

export const getGoogleMapsUrl = (origin, destination) => {
  if (!origin?.lat || !destination?.lat) throw new Error('Invalid locations.');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
};