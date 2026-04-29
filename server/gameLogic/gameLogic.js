
// elo formula
// https://en.wikipedia.org/wiki/Elo_rating_system#Different_ratings_systems


// below is the website/document used for this formula
// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53/ 

const K = 32;

const expectedScore = (ratingA, ratingB) =>{
    return 1/(1+Math.pow(10, (ratingB- ratingA) / 400));
}

const updateRating = (ratingA, ratingB, resultA) =>{
    const expectedA = expectedScore(ratingA, ratingB);

    const newRatingA = ratingA + K *  (resultA - expectedA);
    const newRatingB = ratingB + K * ( ( 1-resultA) - (1-expectedA));

    return {
        newRatingA: Math.round(newRatingA),
        newRatingB: Math.round(newRatingB),
    };
};





module.exports = {updateRating};