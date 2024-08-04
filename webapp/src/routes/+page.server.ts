import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data, error } = await supabase.from("countries").select();
  return {
    countries: data ?? [],
  };
}