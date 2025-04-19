alter table "public"."Player" drop column "is_active";

alter table "public"."Player" add column "is_online" boolean not null default true;

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


