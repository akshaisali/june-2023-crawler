import os

import psycopg2
import requests
from bs4 import BeautifulSoup

import models
import utils as utils

db = psycopg2.connect("dbname=lyrics")

logger = utils.get_logger()

# Crawler functions
def crawl_artists(data, count=10):
    """
    Inputs :
      1. HTML string which contains a list of artists. 
      2. Count is the maximum number of artists that will be returned.

    Outputs:
      1. A list each element of which is of the form
         ("artist name", link to tracks of artist)

    Description of what this does:
      Parses the input HTML, find the list of artists. Creates a list as mentioned in outputs and returns the list
    
    """
    soup = BeautifulSoup(data, features="html.parser") # Create a BeautifulSoup object by parsing the HTML data
    artists = soup.find_all("td", {"class": "td-last"}) # Search for all artist td nodes in the BeautifulSoup object
    ret = []# Initialize an empty list to store the artist information
    for i in artists: # Iterate over each artist td node
        a = i.find("a")# Find the first anchor tag inside the current artist td node
        ret.append((a.text.strip(), a["href"])) # Extract the name and target from the anchor tag and append them to the 'ret' list
        if count is not None:
            count -= 1
            if count == 0:
                break

    return ret

def crawl_tracks_of_artist(data, count=5):
    """
    Inputs : 
      HTML string which contains all tracks of a single artist

    Outputs :
      A list each element of which is of the form
      ("track name", "lyrics of the song")

    Description : 
      Parses the input HTML to find all the tracks of the artist. Creates a list like mentioned in the output
    
    """
    soup = BeautifulSoup(data, features="html.parser")
    tracks = soup.find("table", {"class" : "tracklist"})
    ret = []
    for track in list(tracks.find_all("a")):
        lyrics_page = requests.get(track['href']).text
        lyrics = extract_lyrics(lyrics_page)
        ret.append([track.text.strip(), lyrics])
        if count is not None:
            count -=1
            if count == 0:
                break

    return ret
    
def extract_lyrics(data):
    soup = BeautifulSoup(data, features="html.parser")    
    lyrics = soup.find("p", {"id" : "songLyricsDiv"})
    if lyrics:
        lyrics = lyrics.text
    else:
        lyrics = ""
    return lyrics

def crawl(start_url, nartists, ntracks):
    data = requests.get(start_url).text
    artists = crawl_artists(data, nartists)
    for artist_name, artist_link in artists:
        logger.info("Downloading %s", artist_name)
        tracks_page = requests.get(artist_link).text
        tracks = crawl_tracks_of_artist(tracks_page, ntracks)
        for track_name, lyrics in tracks:
            models.save_track_to_db(artist_name, track_name, lyrics)

            logger.debug(" Downloading song %s", track_name)


# [3.7.3] >>> import lyrics.models
# [3.7.3] >>> import sqlalchemy as sa
# [3.7.3] >>> from sqlalchemy.orm import Session
# [3.7.3] >>>
# [3.7.3] >>>
# [3.7.3] >>> engine = sa.create_engine("postgresql:///lyrics")                                      
# [3.7.3] >>> session = Session(engine)
# [3.7.3] >>>
# [3.7.3] >>> a = lyrics.models.Artists(name="Iron Maiden")                                          
# [3.7.3] >>> a
# <lyrics.models.Artists object at 0x7f48e1c6aa58>
