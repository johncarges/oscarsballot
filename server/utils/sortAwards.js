export default function sortAwards(awards) {

    const awardsList = {
        "Animated Feature Film": 1,
        "Actor in a Supporting Role": 2,
        "Actress in a Supporting Role": 3,
        "Documentary Feature Film": 4,
        "Live Action Short Film": 5,
        "Cinematography":6,
        "Makeup and Hairstyling": 7,
        "Costume Design": 8,
        "International Feature Film": 9,
        "Documentary Short Film": 10,
        "Animated Short Film": 11, 
        "Production Design": 12,
        "Music (Original Score)": 13,
        "Visual Effects": 14,
        "Writing (Original Screenplay)": 15,
        "Writing (Adapted Screenplay)": 16,
        "Sound": 17,
        "Music (Original Song)": 18,
        "Film Editing": 19,
        "Directing": 20,
        "Actor in a Leading Role": 21,
        "Actress in a Leading Role": 22,
        "Best Picture": 23
    }

    return awards.toSorted((a, b) => awardsList[a.name] - awardsList[b.name])

}