import { supabase } from "$lib/supabaseClient";

export async function load() {

  const { data, error } = await supabase.from("countries").select();

  if (error) {
    console.error('Error fetching countries:', error);
    return {
      countries: [],
      error: error.message
    };
  }

  return {
    countries: data ?? [],
  };
}