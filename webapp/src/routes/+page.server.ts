import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const { data, error } = await supabase.from("Category").select('id, name, picture_path');
    
        if (error) {
            throw new Error('Error fetching categories:' + error.message);
        }
    
        return {
            success: true,
            categories: data as Partial<Category>[],
            error: null
        };
    } catch (error) {
        return {
            success: false,
            categories: [],
            error: (error as Error).message
        };
    }
}