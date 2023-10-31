$(document).ready(function () {
    const albumImage = document.getElementById('divShowsImage');
    const albumName = document.getElementById('albumName');
    const albumGenre = document.getElementById('albumGenre');
    const albumYear = document.getElementById("albumYear");

    const numberOfSongs = 99;
    const idPrefix = 'song';
    const trackFinderPrefix = 'trackFound2';
    const songName = [];
    const previewUrls = []; // Array to store preview URLs
    let alreadyPlayingThis = null;

    for (let i = 1; i <= numberOfSongs; i++) {
        const songID = `${idPrefix}${i.toString().padStart(3, '0')}`;
        songName[i] = document.getElementById(songID);
    }

    let currentAudio = null;
    let audioPlaying = false;

    const clientId = '5edc273a1f224369951898cbad23da55';
    const clientSecret = 'c786bb718b2141aabe74f3d6d381c869';

    // Step 1: Get Spotify Access Token
    fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
    })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;

            // Step 2: Search for the Song on Spotify
            for (let i = 1; i <= numberOfSongs; i++) {
                const trackID = `${idPrefix}${i.toString().padStart(3, '0')}`;
                const trackBeforeExtract = document.getElementById(trackID);
                const artist = trackBeforeExtract.lastChild.textContent;
                const track = trackBeforeExtract.firstChild.textContent;

                fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(`track:${track} artist:${artist}`)}&type=track`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        
                        const trackFound = data.tracks.items[0]; // pega a primeira musica do search result
                        const trackFound2 = data.tracks.items[1];
                        
                      
                       
                            
                        let somando = 1;

                        if (trackFound) {

                            // Store the previewUrl for each song
                           

                            songName[i].addEventListener("mouseover", () => {
                                albumName.textContent = trackFound.album.name;
                                albumName.textContent = albumName.textContent.replace(/\([^)]*\)/g, '');

                                albumYear.textContent = trackFound.album.release_date.split('-')[0];

                                albumImage.style.backgroundImage = `url(${trackFound.album.images[0].url})`;
                                if (i == 42 || i == 11)
                                {
                                    albumImage.style.backgroundImage = `url(${trackFound2.album.images[0].url})`;
                                }
                                previewUrls[i] = trackFound.preview_url;
                                
                                const artistId = trackFound.artists[0].id; // Assuming the first artist in the list
                                
                                fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                                    headers: {
                                        "Authorization": `Bearer ${accessToken}`,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(artistData => {
                                        console.log("Artist Data:", artistData);
                                        albumGenre.textContent = artistData.genres[0];
                                    })
                                    .catch(error => {
                                        console.error("Error fetching artist data:", error);
                                    });
                              

                               /* if (previewUrls[i] == null) 
                                {
                                    previewUrls[i] = trackFound2.preview_url;
                                } Ideia boa pra quando nao tiver preview. Isso busca a proxima versao da musica (re-record, live, etc...) porem na pratica a API do spotify pega uns covers nada haver 95% do tempo.*/
                                
                                var audio = new Audio();
                                if (audioPlaying == true) { //quando um audio esta tocando (audioPlaying == true), ou seja, este if faz com que nao tenha mais de 1 audio ao mesmo tempo
                                
                                    if (alreadyPlayingThis != previewUrls[i]){
                                        currentAudio.pause();
                                        console.log("Audio Paused! I am Working!");}
                                        else{
                                            console.log("Look! Somebody Hovered the same song and I did not Play it again! Am I a good boy?")
                                        }
                                    }
                                
                                
                                if (previewUrls[i]) { 
                                    if (previewUrls[i] != alreadyPlayingThis){
                                    alreadyPlayingThis = previewUrls[i];
                                    audio.src = previewUrls[i];
                                   
                                  
                                   // setTimeout(function(){audio.play();}, 500);
                                  //previewUrls[i].animate({volume: 0},{volume: 1}, 1000);
                                    audio.play();
                                    
                                    currentAudio = audio;
                                    audioPlaying = true;
                                    console.log("Audio is Playing!!");
                                    console.log(audio.volume);
                                    }
                                }

                                audio.addEventListener("ended", function(){ //faz o audio se repetir quando a preview de 30 segundos acaba (30s eh o padrao do spotify API)
                                    console.log("Preview Ended! I Will Play Again Now!");
                                    audio.play();

                                })

                            })
                           /* function () {
                                audioPlaying = false;
                                console.log("audioPlaying is false now!!!");
                            }*/


                              /*  fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                                    headers: {
                                        "Authorization": `Bearer ${accessToken}`,
                                    },
                                })
                                    .then(response => response.json())
                                    .then(artistData => {
                                        console.log("Artist Data:", artistData);
                                        albumGenre.textContent = artistData.genres[0];
                                    })
                                    .catch(error => {
                                        console.error("Error fetching artist data:", error);
                                    });
                              


*/

                        }
                    })
                    .catch(error => {
                        console.error("Error fetching song data:", error);
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching access token:", error);
        });



        function sortList() {
            let switching = true;
            let shouldSwitch;
            let listing;
            let collectionOfSongs;
            let j;
        
            listing = document.getElementsByClassName("listOfSongs");
        
            while (switching) {
                switching = false;
        
                for (let i = 0; i < listing.length; i++) {
                    shouldSwitch = false;
                    collectionOfSongs = listing[i].getElementsByTagName("LI");
        
                  
                    for (j = 0; j < collectionOfSongs.length - 1; j++) {
                        if (collectionOfSongs[j].innerHTML.toLowerCase() > collectionOfSongs[j + 1].innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            break; // You can break when a swap is needed
                        }
                    }
        
                    if (shouldSwitch) {
                        collectionOfSongs[j].parentNode.insertBefore(collectionOfSongs[j + 1], collectionOfSongs[j]);
                        switching = true;
                    }
                }
            }
        }
        
        sortList();


/*function sortList()
{
    let switching = true; 
    let shouldSwitch;
    let listing;
    let collectionOfSongs;

    listing = document.getElementsByClassName("listOfSongs");

   

for (let i = 0; i < (listing.length - 1); i++)
{
    collectionOfSongs = listing[i].getElementsByTagName("LI");
    shouldSwitch = false;
    console.log("entrei no for 1");

    if (collectionOfSongs[i].innerHTML.toLowerCase() > collectionOfSongs[i + 1].innerHTML.toLowerCase())
    {
        shouldSwitch = true;
        console.log("entrei no if 1");
    }
    if (shouldSwitch)
    {
        collectionOfSongs[i].parentNode.insertBefore(collectionOfSongs[i + 1], collectionOfSongs[i]);
        console.log("entrei no if 2");
    }

    }
}
sortList();*/



        });
