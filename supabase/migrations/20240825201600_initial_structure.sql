alter table "public"."Game" drop constraint "Game_category_fkey";

alter table "public"."Game" drop constraint "Game_whose_turn_fkey";

alter table "public"."Game" drop column "category";

alter table "public"."Game" drop column "whose_turn";

alter table "public"."Game" add column "category_id" uuid not null;

alter table "public"."Game" add column "whose_turn_id" uuid;

alter table "public"."Game" add constraint "Game_category_fkey" FOREIGN KEY (category_id) REFERENCES "Category"(id) not valid;

alter table "public"."Game" validate constraint "Game_category_fkey";

alter table "public"."Game" add constraint "Game_whose_turn_fkey" FOREIGN KEY (whose_turn_id) REFERENCES "Player"(id) not valid;

alter table "public"."Game" validate constraint "Game_whose_turn_fkey";

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

create policy "Enable read access for all users"
on "public"."Category"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."Game"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."Game"
as permissive
for select
to public
using (true);



