import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase.from("Category").select('id, name, picture_path');

    if (error) {
        console.error('Error fetching countries:', error);
        return {
        categories: [] as Partial<Category>[],
        error: error.message
        };
    }

    return {
        categories: data as Partial<Category>[],
        error: null
    };
}