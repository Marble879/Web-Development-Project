# Backend and Frontend Template

Latest version: https://git.ita.chalmers.se/courses/dit341/group-00-web (public Github [mirror](https://github.com/dit341/group-00-web))

## Project Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| `server/` | Backend server code | All your server code |
| [server/README.md](server/README.md) | Everything about the server | **READ ME** carefully! |
| `client/` | Frontend client code | All your client code |
| [client/README.md](client/README.md) | Everything about the client | **READ ME** carefully! |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Free online production deployment | Deploy your app online in production mode |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.gitlab.com/ce/gitlab-basics/start-using-git.html#add-your-git-username-and-set-your-email)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
* [Chalmers GitLab](https://git.ita.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT341 course group: https://git.ita.chalmers.se/courses/dit341
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/ee/ssh/)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under https://git.ita.chalmers.se/profile/keys
    * Make sure the email you use to commit is registered under https://git.ita.chalmers.se/profile/emails
  * Checkout the [Backend-Frontend](https://git.ita.chalmers.se/courses/dit341/group-00-web) template `git clone git@git.ita.chalmers.se:courses/dit341/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.ita.chalmers.se:courses/dit341/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

The system would be a platform where users can find other users to play video games with based on the type of game, the user’s preferred gaming platform, or the user’s prefered ranks. Users can create accounts that would contain information about their game platform usernames, game genre preferences, and previous post history. The purpose of this website is to be able to more easily find people to play with.

### Pages

* Log-in Screen: The log-in screen will prompt a user to enter their credentials and display the logo of the website. If no user      credentials exist, they will be prompted to create an account.

* Account Creation: This page shall be used to create an account for a user. A user will be able to enter their username, their  password, their preferred games, and report their rank as a player. The page shall display text entry fields for the above as well as interactable components for the player to select.

* Home Page: The home page will show a user the popular and  featured games of our website, as well as the games a user has indicated a preference for. A user will be able to navigate to these games from this page. The page should also provide navigation to other screens in the website such as to the user’s profile, activity feed, and notification hub.

* Games: Navigating to this page shall display the full list of games supported by this website. From here, a user will be able to select/deselect their preferred games, which in turn changes which games will be displayed on their home page.
Event Creator: The event creator will allow users to create an event and specify the event details. Specific event details would include the game the users will be playing, the time of the event, event user limit, prefered player rank, private or public event. When users are in an event there will be an event-restricted messaging system to allow for users to communicate.

* Event Page (Specific): The event page would display a list of users (their icon and username). The event page will also display the duration of the event (start and end time) as well as the number of players that have currently joined the event, e.g 20/25.

* Event Browser: The event browser will display active events. The user can also filter the type of events based on the event game, type of event (duos, casual, pvp/pve etc), and platform the event will take place on.

* User Profile: Within the user profile the user's icon, username, prefered platforms and games, posts and post history, ‘active’ LFG posts, and Self-reported ranks for games (Beginner, Casual, Intermediate, Diamond/Pro/Etc) will be displayed. If a user is on their own profile page, they can select a settings cog that will let them edit their profile.

* User settings: The user settings screen would let the user edit their user icon, username, preferred platforms, and rank.

* Notifications: The notifications page would display event join requests, and alerts of events that are starting in 30 minutes. The user can select to delete read notifications, and mute notifications.

* Team Finder: The team finder would be a filtering system to assist in team fills. Users would be able to filter based on user ranks, private or public groups and their prefered game & platform.

* Group: The group page would display a list of users that are in the group, including their username, and icons. The creator of the group would have a gold crown over their icon. The group page will contain a messaging system that acts as a group chat. Information on the group will also be displayed, such as the number of players currently in that group, game & game platform, and preferred rank. Users will have the option to leave the group, and the group creator can also remove users from the group. If the group creator leaves the group, another member will randomly be assigned as the “group creator”/owner.

* Group creation: The group creation page allows users to create groups to play together with others. Within the group creation page details of the group are to be selected, these include, selecting the game and platform to play on, preferred player rank and selecting to make the group private or public.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/er_diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)
