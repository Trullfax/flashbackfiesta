create type "public"."difficulty" as enum ('easy', 'medium', 'hard', 'extreme');

create type "public"."status" as enum ('not_started', 'running', 'completed', 'aborted');

create table "public"."Card" (
    "id" uuid not null default gen_random_uuid(),
    "year" bigint not null,
    "name" character varying not null,
    "creator" character varying,
    "picture_url" character varying not null,
    "game" uuid not null,
    "category" uuid not null,
    "player" uuid
);


alter table "public"."Card" enable row level security;

create table "public"."Category" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "picture_path" character varying,
    "hex_colour" character varying not null default '#000000'::character varying,
    "api_route" character varying
);


alter table "public"."Category" enable row level security;

create table "public"."Game" (
    "id" uuid not null default gen_random_uuid(),
    "status" status not null default 'not_started'::status,
    "whose_turn" uuid,
    "category" uuid not null,
    "max_card_count" bigint not null default '200'::bigint,
    "difficulty" difficulty not null default 'easy'::difficulty
);


alter table "public"."Game" enable row level security;

create table "public"."Player" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "avatar" character varying not null,
    "is_ready" boolean not null default false,
    "cards_count" bigint
);


alter table "public"."Player" enable row level security;

CREATE UNIQUE INDEX "Card_pkey" ON public."Card" USING btree (id);

CREATE UNIQUE INDEX "Category_id_key" ON public."Category" USING btree (id);

CREATE UNIQUE INDEX "Category_pkey" ON public."Category" USING btree (id);

CREATE UNIQUE INDEX "Game_pkey" ON public."Game" USING btree (id);

CREATE UNIQUE INDEX "Player_pkey" ON public."Player" USING btree (id);

alter table "public"."Card" add constraint "Card_pkey" PRIMARY KEY using index "Card_pkey";

alter table "public"."Category" add constraint "Category_pkey" PRIMARY KEY using index "Category_pkey";

alter table "public"."Game" add constraint "Game_pkey" PRIMARY KEY using index "Game_pkey";

alter table "public"."Player" add constraint "Player_pkey" PRIMARY KEY using index "Player_pkey";

alter table "public"."Card" add constraint "Card_category_fkey" FOREIGN KEY (category) REFERENCES "Category"(id) not valid;

alter table "public"."Card" validate constraint "Card_category_fkey";

alter table "public"."Card" add constraint "Card_game_fkey" FOREIGN KEY (game) REFERENCES "Game"(id) not valid;

alter table "public"."Card" validate constraint "Card_game_fkey";

alter table "public"."Card" add constraint "Card_player_fkey" FOREIGN KEY (player) REFERENCES "Player"(id) not valid;

alter table "public"."Card" validate constraint "Card_player_fkey";

alter table "public"."Category" add constraint "Category_id_key" UNIQUE using index "Category_id_key";

alter table "public"."Game" add constraint "Game_category_fkey" FOREIGN KEY (category) REFERENCES "Category"(id) not valid;

alter table "public"."Game" validate constraint "Game_category_fkey";

alter table "public"."Game" add constraint "Game_whose_turn_fkey" FOREIGN KEY (whose_turn) REFERENCES "Player"(id) not valid;

alter table "public"."Game" validate constraint "Game_whose_turn_fkey";

grant delete on table "public"."Card" to "anon";

grant insert on table "public"."Card" to "anon";

grant references on table "public"."Card" to "anon";

grant select on table "public"."Card" to "anon";

grant trigger on table "public"."Card" to "anon";

grant truncate on table "public"."Card" to "anon";

grant update on table "public"."Card" to "anon";

grant delete on table "public"."Card" to "authenticated";

grant insert on table "public"."Card" to "authenticated";

grant references on table "public"."Card" to "authenticated";

grant select on table "public"."Card" to "authenticated";

grant trigger on table "public"."Card" to "authenticated";

grant truncate on table "public"."Card" to "authenticated";

grant update on table "public"."Card" to "authenticated";

grant delete on table "public"."Card" to "postgres";

grant insert on table "public"."Card" to "postgres";

grant references on table "public"."Card" to "postgres";

grant select on table "public"."Card" to "postgres";

grant trigger on table "public"."Card" to "postgres";

grant truncate on table "public"."Card" to "postgres";

grant update on table "public"."Card" to "postgres";

grant delete on table "public"."Card" to "service_role";

grant insert on table "public"."Card" to "service_role";

grant references on table "public"."Card" to "service_role";

grant select on table "public"."Card" to "service_role";

grant trigger on table "public"."Card" to "service_role";

grant truncate on table "public"."Card" to "service_role";

grant update on table "public"."Card" to "service_role";

grant delete on table "public"."Category" to "anon";

grant insert on table "public"."Category" to "anon";

grant references on table "public"."Category" to "anon";

grant select on table "public"."Category" to "anon";

grant trigger on table "public"."Category" to "anon";

grant truncate on table "public"."Category" to "anon";

grant update on table "public"."Category" to "anon";

grant delete on table "public"."Category" to "authenticated";

grant insert on table "public"."Category" to "authenticated";

grant references on table "public"."Category" to "authenticated";

grant select on table "public"."Category" to "authenticated";

grant trigger on table "public"."Category" to "authenticated";

grant truncate on table "public"."Category" to "authenticated";

grant update on table "public"."Category" to "authenticated";

grant delete on table "public"."Category" to "postgres";

grant insert on table "public"."Category" to "postgres";

grant references on table "public"."Category" to "postgres";

grant select on table "public"."Category" to "postgres";

grant trigger on table "public"."Category" to "postgres";

grant truncate on table "public"."Category" to "postgres";

grant update on table "public"."Category" to "postgres";

grant delete on table "public"."Category" to "service_role";

grant insert on table "public"."Category" to "service_role";

grant references on table "public"."Category" to "service_role";

grant select on table "public"."Category" to "service_role";

grant trigger on table "public"."Category" to "service_role";

grant truncate on table "public"."Category" to "service_role";

grant update on table "public"."Category" to "service_role";

grant delete on table "public"."Game" to "anon";

grant insert on table "public"."Game" to "anon";

grant references on table "public"."Game" to "anon";

grant select on table "public"."Game" to "anon";

grant trigger on table "public"."Game" to "anon";

grant truncate on table "public"."Game" to "anon";

grant update on table "public"."Game" to "anon";

grant delete on table "public"."Game" to "authenticated";

grant insert on table "public"."Game" to "authenticated";

grant references on table "public"."Game" to "authenticated";

grant select on table "public"."Game" to "authenticated";

grant trigger on table "public"."Game" to "authenticated";

grant truncate on table "public"."Game" to "authenticated";

grant update on table "public"."Game" to "authenticated";

grant delete on table "public"."Game" to "postgres";

grant insert on table "public"."Game" to "postgres";

grant references on table "public"."Game" to "postgres";

grant select on table "public"."Game" to "postgres";

grant trigger on table "public"."Game" to "postgres";

grant truncate on table "public"."Game" to "postgres";

grant update on table "public"."Game" to "postgres";

grant delete on table "public"."Game" to "service_role";

grant insert on table "public"."Game" to "service_role";

grant references on table "public"."Game" to "service_role";

grant select on table "public"."Game" to "service_role";

grant trigger on table "public"."Game" to "service_role";

grant truncate on table "public"."Game" to "service_role";

grant update on table "public"."Game" to "service_role";

grant delete on table "public"."Player" to "anon";

grant insert on table "public"."Player" to "anon";

grant references on table "public"."Player" to "anon";

grant select on table "public"."Player" to "anon";

grant trigger on table "public"."Player" to "anon";

grant truncate on table "public"."Player" to "anon";

grant update on table "public"."Player" to "anon";

grant delete on table "public"."Player" to "authenticated";

grant insert on table "public"."Player" to "authenticated";

grant references on table "public"."Player" to "authenticated";

grant select on table "public"."Player" to "authenticated";

grant trigger on table "public"."Player" to "authenticated";

grant truncate on table "public"."Player" to "authenticated";

grant update on table "public"."Player" to "authenticated";

grant delete on table "public"."Player" to "postgres";

grant insert on table "public"."Player" to "postgres";

grant references on table "public"."Player" to "postgres";

grant select on table "public"."Player" to "postgres";

grant trigger on table "public"."Player" to "postgres";

grant truncate on table "public"."Player" to "postgres";

grant update on table "public"."Player" to "postgres";

grant delete on table "public"."Player" to "service_role";

grant insert on table "public"."Player" to "service_role";

grant references on table "public"."Player" to "service_role";

grant select on table "public"."Player" to "service_role";

grant trigger on table "public"."Player" to "service_role";

grant truncate on table "public"."Player" to "service_role";

grant update on table "public"."Player" to "service_role";

grant delete on table "public"."countries" to "postgres";

grant insert on table "public"."countries" to "postgres";

grant references on table "public"."countries" to "postgres";

grant select on table "public"."countries" to "postgres";

grant trigger on table "public"."countries" to "postgres";

grant truncate on table "public"."countries" to "postgres";

grant update on table "public"."countries" to "postgres";


