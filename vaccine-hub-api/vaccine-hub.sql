\echo 'Delete and recreate vaccine-hub.sql?'
\prompt 'Return for yes or ctrl+c for no' answer

DROP DATABASE vaccine_hub;
CREATE DATABASE vaccine_hub;
\connect vaccine_hub;

\i vaccine-hub-schema.sql