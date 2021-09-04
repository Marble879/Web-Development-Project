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

With this website, the focus orients around displaying images/artwork in a curated environment. Users will be able to create collections of images, view other users’ collections, upload images/artwork, and also search by tag in order to build up their own collections of favorite pieces. 

### Pages

* Create account: In the user account page creation of a user is done by creating a username, password, selecting a user icon based on presets and small bio about themselves. After creating an account the user is redirected to the “Home page.”

* Log-in: In the log-in page, the user will be able to input their username and password that they have previously created. Upon successfully logging in they will be redirected to the “Home page.” If they have not made an account, they will be able to be redirected to the create account page.

* Home page: On the home page, a user will see the following: an option to be redirected to view their user page, an option to be redirected to the view post page. By default, there will also be a display of tags from our presets from user uploaded images. A filtering option will be presented to a user which, when a user selects an option from a list of tags, the display of images will update as per their selection. 

* User page: The user page would contain details on the user, such as their username, user icon, and bio. The user’s collections would also be shown on their page. Each user will have a default collection containing all their uploaded posts and a collection containing their favorite posts. The collections will have a thumbnail from the first image in that collection. There will also be an icon to create a new collection, which will cause a pop-out menu to appear. This pop-out menu will then take its input as the collection’s name.

* Post creation page: In the post creation page, a user is able to upload an artwork; after which, the user is told to add post criteria which include: add related tags, add a description, add a title, add the artwork into the uploader’s prefered collection (which also includes the option to add a collection). After adding the post criteria, the user can post the artwork to which the uploaded artwork will be added to the uploads collection in the user page automatically.

* View post page: When a user selects a post, the “View Post” page will be opened. In this page, users will see the artwork that has been uploaded, a title of the post, and a brief description of the post. Along with this, the uploader’s icon and username will also be displayed. If the username of the uploader is selected, the user will be redirected to the uploaders profile page. Users can also select an icon to add the post to one of their existing collections via a drop down menu, or they can select the heart icon to add the post to their default favorites collection (The heart icon would include the number of favorites from other users. This heart will be filled in once the user selects the heart). If the uploader of the post is on this page, they will have the option to edit the post title, description and choose to delete this post. Lastly, users can also leave a rating, which will be done via selecting stars from 1-5. An average star rating will then be displayed on the post.

* Inside a collection page: On this page, a user will be able to see all of the posts that exist inside of that specific collection. A user will be able to then edit the collection details for the collections that they have specifically added (such as renaming the collection or deleting it). A user can also select one of the posts that exists inside of that collection to be redirected to the “View post page.”

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/er_diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)
