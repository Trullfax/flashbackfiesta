drop policy "Enable read access for all users" on "public"."Category";

drop policy "Enable insert for authenticated users only" on "public"."Game";

drop policy "Enable read access for all users" on "public"."Game";

drop policy "Enable read access for all users" on "public"."countries";

revoke delete on table "public"."countries" from "anon";

revoke insert on table "public"."countries" from "anon";

revoke references on table "public"."countries" from "anon";

revoke select on table "public"."countries" from "anon";

revoke trigger on table "public"."countries" from "anon";

revoke truncate on table "public"."countries" from "anon";

revoke update on table "public"."countries" from "anon";

revoke delete on table "public"."countries" from "authenticated";

revoke insert on table "public"."countries" from "authenticated";

revoke references on table "public"."countries" from "authenticated";

revoke select on table "public"."countries" from "authenticated";

revoke trigger on table "public"."countries" from "authenticated";

revoke truncate on table "public"."countries" from "authenticated";

revoke update on table "public"."countries" from "authenticated";

revoke delete on table "public"."countries" from "service_role";

revoke insert on table "public"."countries" from "service_role";

revoke references on table "public"."countries" from "service_role";

revoke select on table "public"."countries" from "service_role";

revoke trigger on table "public"."countries" from "service_role";

revoke truncate on table "public"."countries" from "service_role";

revoke update on table "public"."countries" from "service_role";

alter table "public"."countries" drop constraint "countries_pkey";

drop index if exists "public"."countries_pkey";

drop table "public"."countries";

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

create policy "Enable insert for anon key"
on "public"."Card"
as permissive
for insert
to anon
with check (true);


create policy "Enable read for anon key"
on "public"."Card"
as permissive
for select
to anon
using (true);


create policy "Enable update for anon key"
on "public"."Card"
as permissive
for update
to anon
using (true);


create policy "Enable read for anon key"
on "public"."Category"
as permissive
for select
to anon
using (true);


create policy "Enable insert for anon key"
on "public"."Game"
as permissive
for insert
to anon
with check (true);


create policy "Enable read for anon key"
on "public"."Game"
as permissive
for select
to anon
using (true);


create policy "Enable update access for anon key"
on "public"."Game"
as permissive
for update
to anon
using (true);


create policy "Enable insert for anon key"
on "public"."Player"
as permissive
for insert
to anon
with check (true);


create policy "Enable read for anon key"
on "public"."Player"
as permissive
for select
to anon
using (true);


create policy "Enable update for anon key"
on "public"."Player"
as permissive
for update
to anon
using (true);



