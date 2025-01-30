const BASE_URL = "https://localhost:7197"

export async function getGenres(){

try {
    const genreResponse = await fetch(BASE_URL + "/api/Metadata/genres");
    const genreData = await genreResponse.json();
    return genreData
    } catch (error) {
        console.error(error);
        throw new Error("Hiba a műfajok lekérése során!")
    }
}

export async function getCategories(){

    try {
        const categoriesResponse = await fetch(BASE_URL + "/api/Metadata/categories");
        const categoriesData = await categoriesResponse.json();
        return categoriesData
        } catch (error) {
            console.error(error);
            throw new Error("Hiba a kategóriák lekérése során!")

        }
    }