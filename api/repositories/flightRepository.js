const db = require('../db');

async function findAllWithDetails() {
  const { rows } = await db.query(`
    WITH trolley_details AS (
      SELECT
        t.trolley_id,
        t.trolley_qr_id,
        t.flight_route_id,
        -- Aggregate Origin Config
        (SELECT json_build_object(
            'trolley_config_id', origin_tc.trolley_config_id,
            'name', origin_tc.name,
            'baskets', (SELECT json_agg(json_build_object(
              'position', tcb.position_identifier,
              'basket_config_id', bc.basket_config_id,
              'name', bc.name,
              'products', (SELECT json_agg(json_build_object(
                'product_id', p.product_id,
                'name', p.name,
                'expected_quantity', bcp.expected_quantity
              )) FROM basket_config_product bcp JOIN product p ON bcp.product_id = p.product_id WHERE bcp.basket_config_id = bc.basket_config_id)
            )) FROM trolley_config_basket tcb JOIN basket_config bc ON tcb.basket_config_id = bc.basket_config_id WHERE tcb.trolley_config_id = origin_tc.trolley_config_id)
        ) FROM trolley_config origin_tc WHERE origin_tc.trolley_config_id = t.origin_trolley_config_id) AS origin_config,
        -- Aggregate Destination Config
        (SELECT json_build_object(
            'trolley_config_id', dest_tc.trolley_config_id,
            'name', dest_tc.name,
            'baskets', (SELECT json_agg(json_build_object(
              'position', tcb.position_identifier,
              'basket_config_id', bc.basket_config_id,
              'name', bc.name,
              'products', (SELECT json_agg(json_build_object(
                'product_id', p.product_id,
                'name', p.name,
                'expected_quantity', bcp.expected_quantity
              )) FROM basket_config_product bcp JOIN product p ON bcp.product_id = p.product_id WHERE bcp.basket_config_id = bc.basket_config_id)
            )) FROM trolley_config_basket tcb JOIN basket_config bc ON tcb.basket_config_id = bc.basket_config_id WHERE tcb.trolley_config_id = dest_tc.trolley_config_id)
        ) FROM trolley_config dest_tc WHERE dest_tc.trolley_config_id = t.destination_trolley_config_id) AS destination_config
      FROM trolley t
    )
    SELECT
      fr.flight_route_id,
      fr.route_number,
      fr.origin,
      fr.destination,
      (SELECT json_agg(td) FROM trolley_details td WHERE td.flight_route_id = fr.flight_route_id) AS trolleys
    FROM flight_route fr;
  `);
  return rows;
}

module.exports = {
  findAllWithDetails,
};