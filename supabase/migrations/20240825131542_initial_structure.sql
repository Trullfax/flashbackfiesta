alter table "public"."Card" drop constraint "Card_category_fkey";

alter table "public"."Card" drop constraint "Card_game_fkey";

alter table "public"."Card" drop constraint "Card_player_fkey";

alter table "public"."Card" drop column "category";

alter table "public"."Card" drop column "game";

alter table "public"."Card" drop column "player";

alter table "public"."Card" add column "game_id" uuid not null;

alter table "public"."Card" add column "player_id" uuid;

alter table "public"."Category" drop column "hex_colour";

alter table "public"."Category" add column "hex_color" character varying not null default '#000000'::character varying;

alter table "public"."Player" drop column "avatar";

alter table "public"."Player" add column "avatar_path" character varying not null;

alter table "public"."Player" add column "game_id" uuid not null;

alter table "public"."Player" add constraint "Player_game_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) not valid;

alter table "public"."Player" validate constraint "Player_game_fkey";

alter table "public"."Card" add constraint "Card_game_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) not valid;

alter table "public"."Card" validate constraint "Card_game_fkey";

alter table "public"."Card" add constraint "Card_player_fkey" FOREIGN KEY (player_id) REFERENCES "Player"(id) not valid;

alter table "public"."Card" validate constraint "Card_player_fkey";

grant delete on table "public"."Card" to "postgres";

grant insert on table "public"."Card" to "postgres";

grant references on table "public"."Card" to "postgres";

grant select on table "public"."Card" to "postgres";

grant trigger on table "public"."Card" to "postgres";

grant truncate on table "public"."Card" to "postgres";

grant update on table "public"."Card" to "postgres";

grant delete on table "public"."Category" to "postgres";

grant insert on table "public"."Category" to "postgres";

grant references on table "public"."Category" to "postgres";

grant select on table "public"."Category" to "postgres";

grant trigger on table "public"."Category" to "postgres";

grant truncate on table "public"."Category" to "postgres";

grant update on table "public"."Category" to "postgres";

grant delete on table "public"."Game" to "postgres";

grant insert on table "public"."Game" to "postgres";

grant references on table "public"."Game" to "postgres";

grant select on table "public"."Game" to "postgres";

grant trigger on table "public"."Game" to "postgres";

grant truncate on table "public"."Game" to "postgres";

grant update on table "public"."Game" to "postgres";

grant delete on table "public"."Player" to "postgres";

grant insert on table "public"."Player" to "postgres";

grant references on table "public"."Player" to "postgres";

grant select on table "public"."Player" to "postgres";

grant trigger on table "public"."Player" to "postgres";

grant truncate on table "public"."Player" to "postgres";

grant update on table "public"."Player" to "postgres";

grant delete on table "public"."countries" to "postgres";

grant insert on table "public"."countries" to "postgres";

grant references on table "public"."countries" to "postgres";

grant select on table "public"."countries" to "postgres";

grant trigger on table "public"."countries" to "postgres";

grant truncate on table "public"."countries" to "postgres";

grant update on table "public"."countries" to "postgres";


