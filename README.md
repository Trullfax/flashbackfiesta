<img width="1920" height="625" alt="Flashback Fiesta Startpage (1)" src="https://github.com/user-attachments/assets/2fa46fd1-d2d0-4227-accc-cdc9ab13eedd" />


This web application adapts the analog card game "Timeline."  The goal of the game is to arrange the cards in your hand in the correct chronological order. Cards are divided into categories: Movies, Music, and TV Shows. If a card is placed incorrectly, a new card must be drawn. The game ends when one person successfully plays all their cards.

## Code License

This project is open-source and the code is licensed under the GNU General Public License v3.0 (GPL-3.0).

You are free to use, modify, and distribute the software under the terms of this license, as long as you adhere to its requirements, including the need to share any modifications under the same license.

For more details on the terms and conditions of this license, please refer to the [LICENSE](LICENSE) file in this GitHub repository.

## Data Attribution

### Wikidata
This project incorporates data from Wikidata, which is licensed under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. This means that the data is free to use for any purpose, without any restrictions. More information on the Wikidata license can be found [here](https://creativecommons.org/licenses/cc0-1.0/).

### The Movie Database (TMDb)
This project uses data and images from The Movie Database (TMDb) API for movies and TV shows. Please note that this application is not endorsed or certified by TMDb. The use of TMDb content complies with their API Terms of Use for non-commercial applications. You can find TMDb’s licensing terms and guidelines for proper usage on their [official website](https://www.themoviedb.org/documentation/terms-of-use).

### Spotify Web API
This project uses data and images from the Spotify Web API for music information. Please note that this application is not endorsed or certified by Spotify. The use of Spotify content complies with their Developer Terms for non-commercial applications. You can find Spotify’s licensing terms and guidelines for proper usage on their [official website](https://developer.spotify.com/terms/).

## Data Integration Process

For each category (movies, TV shows, and music), this application initially fetches a batch of data items from Wikidata. Due to limitations in Wikidata's image provision, the images displayed for these items are sourced as follows: for movies and TV shows, images are retrieved from The Movie Database (TMDb) using the data provided by Wikidata; for music, images are retrieved from the Spotify Web API using the data provided by Wikidata. Therefore, while the initial data structure originates from Wikidata, visual assets are supplemented from TMDb and Spotify.

## Libraries

This project utilizes the following libraries, each licensed as described below:

*   **Lucide Icon Set:** Licensed under the ISC License. Proper attribution has been provided in accordance with the terms of this license. For more details on the usage and licensing of Lucide, you can refer to their [licensing information](https://lucide.dev/license/).
*   **Svelte Confetti Library:** Licensed under the MIT License. Proper attribution has been provided in accordance with the terms of this license. For more details on the usage and licensing of Svelte Confetti, you can refer to their [website](https://github.com/julianglow/svelte-confetti).

---
