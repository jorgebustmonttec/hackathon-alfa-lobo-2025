const db = require('../db');

/**
 * Finds a complete, nested trolley configuration by its ID.
 * This includes all baskets and the products within each basket.
 * @param {string} trolleyConfigId - The UUID of the trolley configuration.
 * @returns {Promise<object|null>} The fully nested configuration object, or null if not found.
 */
async function findFullTrolleyConfigById(trolleyConfigId) {
  const query = `
    SELECT
        tc.trolley_config_id,
        tc.name,
        tc.description,
        -- Aggregate all baskets associated with this trolley config into a JSON array
        (
            SELECT json_agg(baskets_agg)
            FROM (
                SELECT
                    tcb.position_identifier,
                    bc.basket_config_id,
                    bc.name,
                    -- Aggregate all products within each basket into a JSON array
                    (
                        SELECT json_agg(products_agg)
                        FROM (
                            SELECT
                                p.product_id,
                                p.name,
                                p.barcode,
                                bcp.expected_quantity
                            FROM product p
                            JOIN basket_config_product bcp ON p.product_id = bcp.product_id
                            WHERE bcp.basket_config_id = bc.basket_config_id
                            ORDER BY p.name
                        ) AS products_agg
                    ) AS products
                FROM basket_config bc
                JOIN trolley_config_basket tcb ON bc.basket_config_id = tcb.basket_config_id
                WHERE tcb.trolley_config_id = tc.trolley_config_id
                ORDER BY tcb.position_identifier
            ) AS baskets_agg
        ) AS baskets
    FROM trolley_config tc
    WHERE tc.trolley_config_id = $1
    GROUP BY tc.trolley_config_id;
  `;
  const { rows } = await db.query(query, [trolleyConfigId]);
  return rows[0] || null;
}

module.exports = {
  findFullTrolleyConfigById,
};