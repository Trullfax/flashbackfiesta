import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const { gameId } = params;
    
        if (!gameId) {
            throw new Error("gameId is invalid");
        }
    
        const { data, error } = await supabase
            .from("Game")
            .select('difficulty, Category (api_route, hex_color, name, picture_path, id)')
            .eq('id', gameId);

        console.log(data)

        if (error || !data) {
            throw new Error('Error fetching game in gameId: ' + (error?.message || 'No data found'));
        }

        const category = data[0].Category as Category;

        if (!category) {
            throw new Error('No category found for this game.');
        }

        const numberOfCards = 10;
        const categoryId = category.id;
        const difficulty = data[0].difficulty;
        const apiRoute = category.api_route;

        if(!apiRoute) {
            throw new Error('No api route found for this game.');   
        }
        console.log(category);
        console.log(apiRoute);

        const response = await fetch(apiRoute, {
            method: 'POST',
            body: JSON.stringify({ gameId, categoryId, difficulty, numberOfCards }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error('Error from fetching card api: ' + errorResponse.message);
        }

        const successResponse = await response.json();

        return {
            error: null,
            message: successResponse.message,
        };
    } catch (error) {
        return {
            error: (error as Error).message
        };
    }
};
