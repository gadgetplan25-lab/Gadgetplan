const axios = require('axios');

/**
 * Calculate shipping cost using RajaOngkir API
 * @param {string|number} origin - Origin city ID
 * @param {string|number} destination - Destination city ID
 * @param {number} weight - Weight in grams
 * @param {string} courier - Courier code (default: 'jne')
 * @returns {Promise<{cost: number, detail: object|null}>}
 */
async function calculateShippingCost(origin, destination, weight = 1000, courier = 'jne') {
  try {
    // Validate inputs
    origin = String(origin).trim();
    destination = String(destination).trim();

    if (!origin || isNaN(Number(origin))) {
      throw new Error('Invalid origin city ID');
    }
    if (!destination || isNaN(Number(destination))) {
      throw new Error('Invalid destination city ID');
    }

    const params = new URLSearchParams({
      origin: origin,
      destination: destination,
      weight: weight.toString(),
      courier: courier,
      originType: "city",
      destinationType: "city"
    });

    const response = await axios.post(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      params,
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const data = response.data?.data || [];

    if (data.length > 0) {
      // Get cheapest option
      const sorted = data.sort((a, b) => a.cost - b.cost);
      const cheapest = sorted[0];

      return {
        cost: cheapest.cost,
        detail: {
          courier: cheapest.name,
          code: cheapest.code,
          service: cheapest.service,
          description: cheapest.description,
          etd: cheapest.etd,
          cost: cheapest.cost
        }
      };
    }

    console.warn('[RajaOngkir] No shipping options available');
    return { cost: 0, detail: null };

  } catch (error) {
    console.error('[RajaOngkir] Error:', error.message);
    if (error.response) {
      console.error('[RajaOngkir] Response:', error.response.data);
    }
    throw error;
  }
}

module.exports = { calculateShippingCost };