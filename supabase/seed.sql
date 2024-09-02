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
	('67a122be-1207-4105-bf13-e4b7fd33ab71', 'Movies', '/assets/categories/movie-card.svg', '#ff847c', '/api/generate-cards/movies'),
	('f45ab00a-e923-4e68-a43e-4c5dddea8d45', 'TV-Shows', '/assets/categories/tv-card.svg', '#54e5c4', '/api/generate-cards/tv-shows');


--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Player" ("id", "name", "avatar_path", "is_ready", "cards_count", "game_id", "is_creator") VALUES
	('f2f20bac-1f5d-49bb-96f4-4d2fb507334b', 'david32g', '/assets/avatars/pou_2.svg', false, NULL, 'da654b8e-c581-4707-a710-ecb0c242cdef', true),
	('11ea4ca6-a512-4181-8e3f-df7aac7b731b', 'tjalf2912', '/assets/avatars/pou_1.svg', false, NULL, 'da654b8e-c581-4707-a710-ecb0c242cdef', false),
	('0ae68c86-6655-4a11-bbc5-7c754a32b0e6', 'AL', '/assets/avatars/pou_1.svg', false, NULL, '4c3c5f66-78bc-46d6-82bb-77e832760457', true),
	('fe1e8f1e-9833-4184-a664-de1506c6550b', 'fsdf', '/assets/avatars/pou_1.svg', false, NULL, 'bd0b8090-27f4-4ca8-8caf-577bd11018b5', true);


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Game" ("id", "status", "whose_turn_id", "category_id", "max_card_count", "difficulty", "creator_code") VALUES
	('4c3c5f66-78bc-46d6-82bb-77e832760457', 'not_started', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', 200, 'easy', '3bae33ba-7281-4e3f-acd9-b3c015dbb678'),
	('bd0b8090-27f4-4ca8-8caf-577bd11018b5', 'running', NULL, 'f45ab00a-e923-4e68-a43e-4c5dddea8d45', 200, 'easy', 'e3b3b17f-16c4-42ef-9be5-e0a450731a0f'),
	('da654b8e-c581-4707-a710-ecb0c242cdef', 'running', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', 200, 'easy', '4e22a29f-78c3-494e-8b4b-0fb934aaf174');


--
-- Data for Name: Card; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

INSERT INTO "public"."Card" ("id", "year", "name", "creator", "picture_url", "game_id", "player_id", "category_id", "in_deck") VALUES
	('f16e6b70-9f10-468f-9df6-ec3990c7ab46', 2021, 'No Time to Die', 'Cary Joji Fukunaga', 'https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('0aa90f6e-c6a2-4fab-9d9b-ca128d44c5a9', 2006, 'Ice Age: The Meltdown', 'Carlos Saldanha', 'https://image.tmdb.org/t/p/w500/zDduhCHasKQ9YOTvlOreHem7Wbi.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('b24f9519-f5dd-4111-95b8-f926e1f1b039', 2009, 'Zombieland', 'Ruben Fleischer', 'https://image.tmdb.org/t/p/w500/dUkAmAyPVqubSBNRjRqCgHggZcK.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('a80c8119-027c-4a05-ac67-e58217b7d083', 2011, 'Kung Fu Panda 2', 'Jennifer Yuh Nelson', 'https://image.tmdb.org/t/p/w500/mtqqD00vB4PGRt20gWtGqFhrkd0.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('ff6e90c4-b915-4581-b086-cbc27cfd823e', 1994, 'Léon: The Professional', 'Luc Besson', 'https://image.tmdb.org/t/p/w500/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('4b0f7b5b-552e-43e9-8d73-f5a62f33332b', 1989, 'Indiana Jones and the Last Crusade', 'Steven Spielberg', 'https://image.tmdb.org/t/p/w500/sizg1AU8f8JDZX4QIgE4pjUMBvx.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('7e403e35-70cb-4af6-80cc-d28155006c33', 2012, 'Madagascar 3: Europe''s Most Wanted', 'Tom McGrath, Eric Darnell, Conrad Vernon', 'https://image.tmdb.org/t/p/w500/ekraj4ksvIKeuvQVEevEJkuybZd.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('11595cd3-7c3f-40ff-8c5d-4cab68813c5d', 1999, 'The Mummy', 'Stephen Sommers', 'https://image.tmdb.org/t/p/w500/yhIsVvcUm7QxzLfT6HW2wLf5ajY.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('27544af0-052f-495f-ac6e-db32e3291df3', 2008, 'Mamma Mia!', 'Phyllida Lloyd', 'https://image.tmdb.org/t/p/w500/zdUA4FNHbXPadzVOJiU0Rgn6cHR.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('05481950-0f21-421c-94ba-6e677c89fa62', 1979, 'Apocalypse Now', 'Francis Ford Coppola', 'https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('04adada1-2aab-4b11-8122-c6ed231d4293', 1997, 'The Lost World: Jurassic Park', 'Steven Spielberg', 'https://image.tmdb.org/t/p/w500/jElpCJkSaRPYwIMwZY28gOKV7BK.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('bf911fda-8be8-4fb0-aa6a-7ae0a4fa1ee6', 1925, 'Battleship Potemkin', 'Sergei Eisenstein', 'https://image.tmdb.org/t/p/w500/hZmsRLsCnE9Zshf1YJONUpCOhds.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('27a42960-4135-4be4-bedb-7fdd077a7db4', 2010, 'Alice in Wonderland', 'Tim Burton', 'https://image.tmdb.org/t/p/w500/o0kre9wRCZz3jjSjaru7QU0UtFz.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('e1257777-8f39-4cd5-ad03-3e8c6f4f6593', 1985, 'Back to the Future', 'Robert Zemeckis', 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('dec2c87e-11ef-4737-ab30-6bcfa3064918', 2022, 'Sonic the Hedgehog 2', 'Jeff Fowler', 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('8e779d95-eaaf-48d2-aae7-a8026bf7e028', 1983, 'Never Say Never Again', 'Irvin Kershner', 'https://image.tmdb.org/t/p/w500/zhoAL4o1STGgLbLxJ9r1ijfyHC9.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('96fe4f92-b267-4bce-9c8c-e150003dcf98', 1974, 'The Godfather Part II', 'Francis Ford Coppola', 'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('6b914240-4ca1-46fa-aaf5-cdac1b71cbd0', 1973, 'The Exorcist', 'William Friedkin', 'https://image.tmdb.org/t/p/w500/5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('35f4bfd8-cfcc-4b4a-a5eb-2c0b36b4f455', 2004, 'The Notebook', 'Nick Cassavetes', 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('d2519e26-b4ef-42d5-a05c-6d5f70ffce23', 2002, 'Minority Report', 'Steven Spielberg', 'https://image.tmdb.org/t/p/w500/qtgFcnwh9dAFLocsDk2ySDVS8UF.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('883ff87e-bb08-4174-952d-a6638a9ada47', 2001, 'Vanilla Sky', 'Cameron Crowe', 'https://image.tmdb.org/t/p/w500/ykCC4LN7K98CL5Pb4CnhIWqoHX3.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false),
	('e1be0dc5-0544-43b1-92b1-addb8e08e30a', 2016, 'Arrival', 'Denis Villeneuve', 'https://image.tmdb.org/t/p/w500/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg', 'da654b8e-c581-4707-a710-ecb0c242cdef', NULL, '67a122be-1207-4105-bf13-e4b7fd33ab71', false);


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
