SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Category" ("id", "name", "picture_path", "hex_color", "api_route") VALUES
	('67a122be-1207-4105-bf13-e4b7fd33ab71', 'Movies', 'assets/categories/movie-card.svg', '#ff847c', '/api/generate-cards/movies'),
	('f45ab00a-e923-4e68-a43e-4c5dddea8d45', 'TV-Shows', 'assets/categories/tv-card.svg', '#54e5c4', '/api/generate-cards/tv-shows');


--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--



--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Game" ("id", "status", "whose_turn_id", "category_id", "max_card_count", "difficulty", "creator_code") VALUES
	('315866c6-0c94-4ca0-b40c-9e6a28fddc2e', 'not_started', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', 200, 'easy', 'db567b92-5765-4878-9420-9aea65de0e76'),
	('2ec306ea-a1d5-4e16-877f-d019ae7bca84', 'not_started', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', 200, 'easy', 'ff8f90a7-baae-4440-8b01-0548801a9678'),
	('5378000c-3dd4-4106-99c1-ae658af6adde', 'not_started', NULL, 'f45ab00a-e923-4e68-a43e-4c5dddea8d45', 200, 'easy', '0033cde1-a87d-43fb-a8cf-7a1ecf97690e');


--
-- Data for Name: Card; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Card" ("id", "year", "name", "creator", "picture_url", "game_id", "player_id", "category_id", "in_deck") VALUES
	('fa8614dc-b7f3-4e5c-8c3d-425d4ff2fc53', 2018, 'Bohemian Rhapsody', 'Bryan Singer', 'https://image.tmdb.org/t/p/w500/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('e192eed3-9bb1-4ab9-8eb0-a6462b9964a7', 2012, 'The Lorax', 'Kyle Balda, Chris Renaud', 'https://image.tmdb.org/t/p/w500/tePFnZFw5JvjwjQjaKkqDPNMLPU.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('85607e84-fb9d-41c7-a1b6-1b243a22001e', 2021, 'The Suicide Squad', 'James Gunn', 'https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('4645c97f-987d-4133-8f27-4045848e68de', 2012, 'Silver Linings Playbook', 'David O. Russell', 'https://image.tmdb.org/t/p/w500/y7iOVneBvITlBdhy6tVqXVOa1Js.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('c8102c03-1c8d-4c06-ae41-63002ab0d846', 1999, 'Star Wars: Episode I – The Phantom Menace', 'George Lucas', 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('6cc925e6-721b-49cb-b1b8-8804744cd838', 2005, 'Chicken Little', 'Mark Dindal', 'https://image.tmdb.org/t/p/w500/ic7HarXbjPE1lCdHGavGA8VLtmy.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('1be2054f-0997-4a6a-9e62-bfe547bdf151', 2010, 'Black Swan', 'Darren Aronofsky', 'https://image.tmdb.org/t/p/w500/rH19vkjAzCZ0HIUvrgB3rowm68h.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('8c84119d-d440-4972-b32d-62ccdde47352', 2003, 'Kill Bill Volume 1', 'Quentin Tarantino', 'https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('716fc3e2-5192-4224-b71b-9d7994c41da0', 2016, 'Zootopia', 'Jared Bush, Byron Howard, Rich Moore', 'https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('54a3a916-2166-45f7-a9e9-2098171da090', 2016, 'Captain America: Civil War', 'Anthony Russo, Joe Russo', 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg', '2ec306ea-a1d5-4e16-877f-d019ae7bca84', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('Assets', 'Assets', NULL, '2024-08-23 15:35:45.201165+00', '2024-08-23 15:35:45.201165+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
