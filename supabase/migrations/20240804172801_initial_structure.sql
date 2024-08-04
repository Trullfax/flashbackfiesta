create table "public"."countries" (
    "id" bigint generated always as identity not null,
    "name" text not null
);


alter table "public"."countries" enable row level security;

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

grant delete on table "public"."countries" to "anon";

grant insert on table "public"."countries" to "anon";

grant references on table "public"."countries" to "anon";

grant select on table "public"."countries" to "anon";

grant trigger on table "public"."countries" to "anon";

grant truncate on table "public"."countries" to "anon";

grant update on table "public"."countries" to "anon";

grant delete on table "public"."countries" to "authenticated";

grant insert on table "public"."countries" to "authenticated";

grant references on table "public"."countries" to "authenticated";

grant select on table "public"."countries" to "authenticated";

grant trigger on table "public"."countries" to "authenticated";

grant truncate on table "public"."countries" to "authenticated";

grant update on table "public"."countries" to "authenticated";

grant delete on table "public"."countries" to "postgres";

grant insert on table "public"."countries" to "postgres";

grant references on table "public"."countries" to "postgres";

grant select on table "public"."countries" to "postgres";

grant trigger on table "public"."countries" to "postgres";

grant truncate on table "public"."countries" to "postgres";

grant update on table "public"."countries" to "postgres";

grant delete on table "public"."countries" to "service_role";

grant insert on table "public"."countries" to "service_role";

grant references on table "public"."countries" to "service_role";

grant select on table "public"."countries" to "service_role";

grant trigger on table "public"."countries" to "service_role";

grant truncate on table "public"."countries" to "service_role";

grant update on table "public"."countries" to "service_role";

grant delete on table "public"."test" to "postgres";

grant insert on table "public"."test" to "postgres";

grant references on table "public"."test" to "postgres";

grant select on table "public"."test" to "postgres";

grant trigger on table "public"."test" to "postgres";

grant truncate on table "public"."test" to "postgres";

grant update on table "public"."test" to "postgres";

create policy "Enable read access for all users"
on "public"."countries"
as permissive
for select
to public
using (true);



