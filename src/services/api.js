import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Top Best Bets
|--------------------------------------------------------------------------
*/

export const getTopBestBets = async () => {
  const response = await api.get("/top-best-bets");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Single Package
|--------------------------------------------------------------------------
*/

export const getPackageBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Package slug is required.");
  }

  const response = await api.get(
    `/packages/${encodeURIComponent(slug)}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Related Packages
|--------------------------------------------------------------------------
*/

export const getRelatedPackages = async (
  packageId,
  travelStyleIds = []
) => {
  if (!packageId) {
    throw new Error("Package ID is required.");
  }

  const ids = Array.isArray(travelStyleIds)
    ? travelStyleIds
    : [];

  const response = await api.get(
    `/packages/${packageId}/related`,
    {
      params: {
        travelStyleIds: JSON.stringify(ids),
      },
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Departure Cities
|--------------------------------------------------------------------------
*/

export const getDepartures = async () => {
  const response = await api.get("/departures");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Destinations / Continents
|--------------------------------------------------------------------------
*/

export const getDestinationsContinents = async () => {
  const response = await api.get(
    "/destinations/continents"
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Travel Styles
|--------------------------------------------------------------------------
*/

export const getTravelStyles = async () => {
  const response = await api.get("/travel-styles");

  return response.data;
};

export default api;