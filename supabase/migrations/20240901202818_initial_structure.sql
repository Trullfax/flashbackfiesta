alter table "public"."Game" alter column "status" drop default;

alter type "public"."status" rename to "status__old_version_to_be_dropped";

create type "public"."status" as enum ('not_started', 'setting_up', 'running', 'completed', 'aborted');

alter table "public"."Game" alter column status type "public"."status" using status::text::"public"."status";

alter table "public"."Game" alter column "status" set default 'not_started'::status;

drop type "public"."status__old_version_to_be_dropped";

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


