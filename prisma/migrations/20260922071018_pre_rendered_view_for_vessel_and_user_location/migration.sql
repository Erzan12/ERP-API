CREATE VIEW "WorkAssignment" AS

SELECT
    ul.id,
    ul.location_name AS name,
    'OFFICE' AS type
FROM "UserLocation" ul
WHERE ul.is_active = true

UNION ALL

SELECT
    v.id,
    v.name,
    'VESSEL' AS type
FROM "Vessel" v
WHERE v.is_active = true;