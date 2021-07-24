# Step 2 - Add Python

Now we have the React app setup with material-ui we can add Python.

There's a project call [pyodide](https://github.com/pyodide/pyodide)
which has compiled Python into WebAssembly. An preliminary npm package
has been published, but I had difficulty crating a stable app with it.
The solution that worked best was to add a `script` tag for the CDN
at the end of the `head` of the `public/index.html`.

```html
...
  <head>
    ...
    <script src="https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js"></script>
  <head>
...
```

This loads all of the code we need to run Python in the browser.
The functions are the available in the `window` global object.

Now we change `src/App.js` to load Python.


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
  constructor(props) {
    super(props)

    this.state = {
      version: null,
      pyodide: null
    }
  }

  componentDidMount() {
    // Load Python.
    window
      .loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.17.0/full/' })
      .then((pyodide) => {
        // Run Python.
        pyodide.runPythonAsync(`
import sys
sys.version
`)
          .then((version) => {
            this.setState({ version, pyodide })
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    const { version } = this.state
    const { classes } = this.props

    return (
      <div className={classes.message}>
        {version == null
          ? <Typography variant="h2">Loading Python</Typography>
          : <Typography variant="h2">Version: {version}</Typography>
        }
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(App)
```

The main bit of code is in `componentDidMount`. First we call `loadPyodide`
from the `window` global object, passing in the CDN url. This will load
the `wasm` image for Python and set up the links between Python and Javascript.
This function is asynchronous. When the promise resolves it returns the
`pyodide` object which is our gateway to the Python WebAssembly.

Using the `pyodide` object we can run Python code with `pyodide.runPythonAsync`
passing in the code as a string. This async function returns a promise which
resolves to the last value in the code. The code simply gets the Python version
which is captured as the last value of the script. This gets set in the state
along with the pyodide object, which we'll need later on.

Finally the `render` method shows either a "loading" message, or the version
we got from Python.

No we can run the app.

```bash
npm start
```

You should see the loading message then the version. We can now run Python
code in the browser with no server support!
