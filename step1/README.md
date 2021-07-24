# Step 1 - create the app and add material-ui

Before we can add the python stuff we need to prepare the react app.

## Create React App

First we need to run `create-react-app` to generate our react application.

```bash
npx create-react-app --use-npm demo-react-pyodide
```

I want to use he material-ui toolkit. At the time of writing 2021-07-24
this toolkit uses react version 16, so the first thing to do is edit
the `package.json`.

Before:

```json
...
  "dependencies": {
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^12.8.3",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3",
    "web-vitals": "^1.1.2"
  },
...
```

After:

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

Now we change the source files to use these. First `index.js`:

Before:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

After:

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

Next we can remove the `index.css`.

Now we change the `app.js`.

Before:

```javascript
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

After:

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
