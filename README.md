# ALBUMIFY - A Spotify API application

## OVERVIEW
This front-end application uses Spotify's Web API to analyze user's top 100 tracks from 3 different time frames to determine the albums that a user has been listening to the most. I was inspired to make this application after receiving my Spotify Wrapped 2022, and wondering why albums were not a part of it. Albumify looks through the array of top tracks, and finds those that are on the same album. It then ensures that the 'album type' is an ALBUM (as opposed to a Single), determines the number of tracks from an album that are in the array, and sorts them in descending order. 

IMPORTANT: Currently, Albumify requires users to manually be given access to the application via the Spotify Developer Dashboard. If you would like access, please DM on twitter @savorycode.

## USER STORY
```
AS A USER I want to view my top albums on Spotify for different time frames
WHEN I open the application
THEN I am prompted to login with my spotify account
WHEN I login to Spotify
THEN I am redirected to the application and presented with the prompts for time frame
WHEN I select a time frame and click the button
THEN I am presented with a list of my top albums for that time frame in descending order
WHEN I click the logout button
THEN I am logged out and the list of albums disappears

```

## LINK TO DEPLOYED APPLICATION
[GO TO ALBUMIFY!](https://albumify.netlify.app/)

## TECHNOLOGIES USED
    * React (create-react-app)
    * Spotify Web API 
    * OAuth Authorization

## DEMO 
![demo gif](./public/assets/albumify_demo.GIF)
Watch a video demo [HERE](https://drive.google.com/file/d/1cb6_vZFoI9MO6qyoDU3TaTwnK8FdLnau/view)

## MEET THE DEVELOPER
Andy Bjerk is the sole creator of this application. 
* You can follow/contact me on [Twitter](http://twitter.com/savorycode)
* Check out my [portfolio](https://savoryboi.github.io/react-portfolio)
* Find me on [LinkedIn](https://linkedin.com/in/andy-bjerk/)

 