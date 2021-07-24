# Step 1 - create the app and add material-ui

Before we can add the Python stuff we need to prepare the React app.

## Create React App

First we need to run `create-react-app` to generate our React application.

```bash
npx create-react-app --use-npm demo-react-pyodide
```

I want to use he material-ui toolkit. At the time of writing 2021-07-24
this toolkit uses React version 16, so the first thing to do is edit
the `package.json`.

```json
...
  "dependencies": {
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "react": "^16.8",
    "react-dom": "^16.8",
    "react-scripts": "4.0.3",
    "web-vitals": "^1.1.2"
  },
...
```

Now we update the packages.

```bash
npm install
```

Finally add `prop-types`.

```bash
npm install prop-types
```

Next we add material-ui.

## Add Material-UI

Next we install material-ui and the roboto typeface.

```bash
npm install @material-ui/core@^4.12 @fontsource/roboto@^4.5
```

Now we change the source files to use these. First `src/index.js`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import '@fontsource/roboto'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <>
    <CssBaseline />
    <App />
  </>,
  document.getElementById('root')
)

reportWebVitals()
```

We've added the `roboto` typeface and added the `CssBaseline` to
create the material-ui styles.

Next we can remove the `src/index.css`.

Now we change the `src/app.js`.


```javascript
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  message: {
    margin: theme.spacing(2)
  }
})

class App extends Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.message}>
        <Typography variant="h2">Hello, World!</Typography>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(App)
```

Now we can remove: `App.css`, `App.test.js`, and `logo.svg`.

The app is now prepared. We can try it with:

```bash
npm start
```
