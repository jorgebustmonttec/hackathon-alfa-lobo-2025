const db = require('../db');

/**
 * Finds all flight routes and nests all related data (trolleys, configs, baskets, products).
 * This is a heavy query intended for debugging or initial data load.
 * @returns {Promise<Array<object>>} A list of all flight routes with fully nested data.
 */
async function findAllWithDetails() {
  // This query is complex because it builds a deeply nested JSON object directly
  // in the database, which is much more efficient than making hundreds of separate queries.
  const query = `
    SELECT
        fr.flight_route_id,
        fr.route_number,
        fr.origin,
        fr.destination,
        (SELECT city_name FROM airport WHERE airport_code = fr.origin) as origin_city,
        (SELECT city_name FROM airport WHERE airport_code = fr.destination) as destination_city,
        (
            SELECT json_agg(trolleys_agg)
            FROM (
                SELECT
                    t.trolley_id,
                    t.trolley_qr_id,
                    -- Subquery to build the origin_config object
                    (SELECT find_full_config(t.origin_trolley_config_id)) as origin_config,
                    -- Subquery to build the destination_config object
                    (SELECT find_full_config(t.destination_trolley_config_id)) as destination_config
                FROM trolley t
                WHERE t.flight_route_id = fr.flight_route_id
            ) AS trolleys_agg
        ) AS trolleys
    FROM flight_route fr
    ORDER BY fr.route_number;
  `;

  // We need a helper function in Postgres to avoid duplicating the massive config query.
  const createFunctionQuery = `
    CREATE OR REPLACE FUNCTION find_full_config(config_id UUID)
    RETURNS json AS $$
    DECLARE
        result json;
    BEGIN
        SELECT
            json_build_object(
                'trolley_config_id', tc.trolley_config_id,
                'name', tc.name,
                'baskets', (
                    SELECT json_agg(json_build_object(
                        'position_identifier', tcb.position_identifier,
                        'basket_config_id', bc.basket_config_id,
                        'name', bc.name,
                        'products', (
                            SELECT json_agg(json_build_object(
                                'product_id', p.product_id,
                                'name', p.name,
                                'expected_quantity', bcp.expected_quantity
                            ))
                            FROM product p
                            JOIN basket_config_product bcp ON p.product_id = bcp.product_id
                            WHERE bcp.basket_config_id = bc.basket_config_id
                        )
                    ))
                    FROM basket_config bc
                    JOIN trolley_config_basket tcb ON bc.basket_config_id = tcb.basket_config_id
                    WHERE tcb.trolley_config_id = tc.trolley_config_id
                )
            )
        INTO result
        FROM trolley_config tc
        WHERE tc.trolley_config_id = config_id;
        RETURN result;
    END;
    $$ LANGUAGE plpgsql;
  `;

  const client = await db.getClient();
  try {
    // Ensure the helper function exists before running the main query
    await client.query(createFunctionQuery);
    const { rows } = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
}

module.exports = {
  findAllWithDetails,
};