INSERT INTO gold_fragebogen (
    day,
    n_visitors,
    n_male,
    n_female,
    n_gender_other,
    age_avg,
    n_age_le13,
    n_age_le17,
    n_age_le24,
    n_age_le34,
    n_age_le49,
    n_age_ge50,
    n_dui,
    n_wesel,
    n_imig
)
WITH parsed AS (
    SELECT
        date(submission_timestamp) AS day,
        besucherkennung,
        RIGHT(besucherkennung, 4) AS mmyy,
        gender,
        birth_country,
        plz3
    FROM silver_fragebogen
),
dated AS (
    SELECT
        day,
        besucherkennung,
        gender,
        birth_country,
        CASE
            WHEN plz3 ~ '^[0-9]{3}$' AND plz3::int BETWEEN 470 AND 472 THEN 'Duisburg'
            WHEN plz3 ~ '^[0-9]{3}$' AND plz3::int IN (464, 465, 474, 475, 476) THEN 'Kreis Wesel'
            ELSE 'Other'
        END AS region,
        CASE
            WHEN mmyy ~ '^[0-9]{4}$'
                 AND SUBSTRING(mmyy, 1, 2)::int BETWEEN 1 AND 12
            THEN make_date(
                CASE
                    WHEN SUBSTRING(mmyy, 3, 2)::int <= EXTRACT(YEAR FROM CURRENT_DATE)::int % 100
                    THEN 2000 + SUBSTRING(mmyy, 3, 2)::int
                    ELSE 1900 + SUBSTRING(mmyy, 3, 2)::int
                END,
                SUBSTRING(mmyy, 1, 2)::int,
                1
            )
            ELSE NULL
        END AS dt
    FROM parsed
),
agg AS (
    SELECT
        day,
        COUNT(*) AS n_visitors,
        COUNT(*) FILTER (WHERE lower(gender) = 'male') AS n_male,
        COUNT(*) FILTER (WHERE lower(gender) = 'female') AS n_female,
        COUNT(*) FILTER (WHERE lower(gender) IN ('diverse', 'other')) AS n_gender_other,
        AVG(EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int) AS age_avg,
        COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 13) AS n_age_le13,
        COUNT(*) FILTER (
            WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 13
              AND EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 17
        ) AS n_age_le17,
        COUNT(*) FILTER (
            WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 17
              AND EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 24
        ) AS n_age_le24,
        COUNT(*) FILTER (
            WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 24
              AND EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 34
        ) AS n_age_le34,
        COUNT(*) FILTER (
            WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 34
              AND EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 49
        ) AS n_age_le49,
        COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 49) AS n_age_ge50,
        COUNT(*) FILTER (WHERE region = 'Duisburg') AS n_dui,
        COUNT(*) FILTER (WHERE region = 'Kreis Wesel') AS n_wesel,
        COUNT(*) FILTER (WHERE birth_country IS DISTINCT FROM 'DE') AS n_imig
    FROM dated
    GROUP BY day
)
SELECT
    day,
    n_visitors,
    n_male,
    n_female,
    n_gender_other,
    age_avg,
    n_age_le13,
    n_age_le17,
    n_age_le24,
    n_age_le34,
    n_age_le49,
    n_age_ge50,
    n_dui,
    n_wesel,
    n_imig
FROM agg
ON CONFLICT (day) DO UPDATE
SET
    n_visitors      = EXCLUDED.n_visitors,
    n_male          = EXCLUDED.n_male,
    n_female        = EXCLUDED.n_female,
    n_gender_other  = EXCLUDED.n_gender_other,
    age_avg         = EXCLUDED.age_avg,
    n_age_le13      = EXCLUDED.n_age_le13,
    n_age_le17      = EXCLUDED.n_age_le17,
    n_age_le24      = EXCLUDED.n_age_le24,
    n_age_le34      = EXCLUDED.n_age_le34,
    n_age_le49      = EXCLUDED.n_age_le49,
    n_age_ge50      = EXCLUDED.n_age_ge50,
    n_dui           = EXCLUDED.n_dui,
    n_wesel         = EXCLUDED.n_wesel,
    n_imig          = EXCLUDED.n_imig;






WITH parsed AS (
    SELECT
        date(submission_timestamp) AS day,
        besucherkennung,
        RIGHT(besucherkennung, 4) AS mmyy,
        gender,
        birth_country,
        plz3

    FROM silver_fragebogen
),
dated AS (
    SELECT
        day,
        besucherkennung,
        gender,
        birth_country,
        CASE
            WHEN plz3::int BETWEEN 470 AND 472 THEN 'Duisburg'
            WHEN plz3::int IN (464, 465, 474, 475, 476) THEN 'Kreis Wesel'
            ELSE 'Other'
        END AS region,
        CASE
            WHEN mmyy ~ '^[0-9]{4}$'
                 AND SUBSTRING(mmyy, 1, 2)::int BETWEEN 1 AND 12
            THEN make_date(
                CASE
                    WHEN SUBSTRING(mmyy, 3, 2)::int <= EXTRACT(YEAR FROM CURRENT_DATE)::int % 100
                    THEN 2000 + SUBSTRING(mmyy, 3, 2)::int
                    ELSE 1900 + SUBSTRING(mmyy, 3, 2)::int
                END,
                SUBSTRING(mmyy, 1, 2)::int,
                1
            )
            ELSE NULL
        END AS dt

    FROM parsed
)
SELECT
    day,
    count(*) n_visitors,
     COUNT(*) FILTER (WHERE gender = 'male')   AS n_male,
    COUNT(*) FILTER (WHERE gender = 'female') AS n_female,
    COUNT(*) FILTER (WHERE gender in ('diverse', 'other')) AS n_gender_other,
    avg(EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int) AS age_avg,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 13 ) AS n_age_le13,
    COUNT(*) FILTER (WHERE (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 13) and
     (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 17) ) AS n_age_le17,
    COUNT(*) FILTER (WHERE (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 17) and
     (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 24) ) AS n_age_le24,
    COUNT(*) FILTER (WHERE (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 24) and
     (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 34) ) AS n_age_le34,
    COUNT(*) FILTER (WHERE (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int > 34) and
     (EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int <= 49) ) AS n_age_le49,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM age(CURRENT_DATE, dt))::int >49) AS n_age_ge50,

     COUNT(*) FILTER (WHERE region = 'Duisburg') AS n_dui,
     COUNT(*) FILTER (WHERE region = 'Kreis Wesel') AS n_wesel,

         COUNT(*) FILTER (WHERE birth_country <> 'DE') AS n_imig
FROM dated
group by day;

