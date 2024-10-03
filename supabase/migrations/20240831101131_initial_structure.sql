alter table "public"."Card" drop constraint "Card_game_fkey";

alter table "public"."Card" drop constraint "Card_player_fkey";

alter table "public"."Player" drop constraint "Player_game_fkey";

alter table "public"."Card" drop constraint "Card_category_id_fkey";

alter table "public"."Card" add constraint "Card_game_id_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Card" validate constraint "Card_game_id_fkey";

alter table "public"."Card" add constraint "Card_player_id_fkey" FOREIGN KEY (player_id) REFERENCES "Player"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Card" validate constraint "Card_player_id_fkey";

alter table "public"."Player" add constraint "Player_game_id_fkey" FOREIGN KEY (game_id) REFERENCES "Game"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."Player" validate constraint "Player_game_id_fkey";

alter table "public"."Card" add constraint "Card_category_id_fkey" FOREIGN KEY (category_id) REFERENCES "Category"(id) ON UPDATE CASCADE not valid;

alter table "public"."Card" validate constraint "Card_category_id_fkey";

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


