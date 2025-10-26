const db = require('../db');

/**
 * Finds a complete, nested trolley configuration by its ID.
 * This includes all baskets and the products within each basket.
 * @param {string} trolleyConfigId - The UUID of the trolley configuration.
 * @returns {Promise<object|null>} The fully nested configuration object, or null if not found.
 */
async function findFullTrolleyConfigById(trolleyConfigId) {
  // This query was incorrect. It has been replaced with a more robust one
  // that correctly builds the nested JSON object for a single configuration.
  const query = `
    SELECT
      json_build_object(
          'trolley_config_id', tc.trolley_config_id,
          'name', tc.name,
          'description', tc.description,
          'baskets', (
              SELECT COALESCE(json_agg(json_build_object(
                  'position_identifier', tcb.position_identifier,
                  'basket_config_id', bc.basket_config_id,
                  'name', bc.name,
                  'products', (
                      SELECT COALESCE(json_agg(json_build_object(
                          'product_id', p.product_id,
                          'name', p.name,
                          'barcode', p.barcode,
                          'expected_quantity', bcp.expected_quantity,
                          'counted_quantity', 0 -- Add a placeholder for the app to fill
                      )), '[]'::json)
                      FROM product p
                      JOIN basket_config_product bcp ON p.product_id = bcp.product_id
                      WHERE bcp.basket_config_id = bc.basket_config_id
                  )
              ) ORDER BY tcb.position_identifier), '[]'::json)
              FROM basket_config bc
              JOIN trolley_config_basket tcb ON bc.basket_config_id = tcb.basket_config_id
              WHERE tcb.trolley_config_id = tc.trolley_config_id
          )
      ) as config
    FROM trolley_config tc
    WHERE tc.trolley_config_id = $1;
  `;
  const { rows } = await db.query(query, [trolleyConfigId]);
  // The result is in a 'config' property, so we extract it.
  return rows[0] ? rows[0].config : null;
}

module.exports = {
  findFullTrolleyConfigById,
};