alter table "public"."Game" add column "winner_id" uuid;

alter table "public"."Game" add constraint "Game_winner_id_fkey" FOREIGN KEY (winner_id) REFERENCES "Player"(id) ON UPDATE CASCADE not valid;

alter table "public"."Game" validate constraint "Game_winner_id_fkey";

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


