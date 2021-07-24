# Step 4

In this step we make the app functional. However, as
the point of this is to show how to run Python in a browser
we won't go through the details of the JavaScript here.

However, what we do want to see is how to use this as a "serverless"
app running python. One way we can do this is with GitHub pages. You
can find the final project [here](https://github.com/rob-blackbourn/demo-react-pyodide).

## Publishing to github pages.

First we set up the repository to use GitHub pages. Clicking the
"settings" icon in the GitHub repository. There is a "Pages" tab on
left of the screen. In the "pages" set the "source" to "main" or
"master" and the "folder" to "docs". You should get a message like:

    Your site is published at https://rob-blackbourn.github.io/demo-react-pyodide/

The contents of the "docs" folder will now be available as a static
web site at the "published at" url shown above.

To generate the web site we create a `.env` file in the root of
the project with the following contents.

```bash
PUBLIC_URL=https://rob-blackbourn.github.io/demo-react-pyodide/
BUILD_PATH=docs
```

The `PUBLIC_URL` is the one provided by the GitHub Pages settings
screen. The `BUILD_PATH` is root `docs` folder where GitHub Pages will
look for the static site. This is the folder where react will build
the app.

Now we can build the app. Committing and pushing to GitHub will start
the process of creating the site. In a few minutes we should be able
to view our react/python app running!