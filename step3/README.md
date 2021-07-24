# Step 3 - generate matrices with Python and numpy.

With Python now available in the browser we can do something
more interesting.

## Python Code

As the purpose of the app is to generate exercises for matrix
multiplication we will need some Python code to do this. We add the file
`src/pythonCode.js` with the following contents.

```javascript
function dotProductExerciseCode(maxNumberOfColumns, maxNumberOfRows) {
  return `
import random
import numpy as np

# Generate random row and column sizes.
m = random.randint(1, ${maxNumberOfRows})
n = random.randint(1, ${maxNumberOfColumns})
p = random.randint(1, ${maxNumberOfColumns})

# Generate the random matrices and calculate the dot product.
rng = np.random.default_rng()
A = rng.integers(low=-10, high=10, size=(m, n), dtype=np.int32)
B = rng.integers(low=-10, high=10, size=(n, p), dtype=np.int32)
C = A @ B
`
}

export async function generateDotProductExercise(pyodide, maxNumberOfRows, maxNumberOfColumns) {
  const code = dotProductExerciseCode(maxNumberOfRows, maxNumberOfColumns)
  await pyodide.runPythonAsync(code)
  const results = {
    m: pyodide.globals.get('m'),
    n: pyodide.globals.get('n'),
    p: pyodide.globals.get('p'),
    A: pyodide.globals
      .get('A')
      .toJs()
      .map((x) => Array.from(x)),
    B: pyodide.globals
      .get('B')
      .toJs()
      .map((x) => Array.from(x)),
    C: pyodide.globals
      .get('C')
      .toJs()
      .map((x) => Array.from(x))
  }
  return results
}
```

The function `dotProductExerciseCode` generates the Python code.
The results are assigned to global variables. First we compute
the random rows and columns. Then we generate the random matrices
using `numpy`, and calculate the dot product. We set the `dtype`
of the `np.array` to `np.int32`, as the default may be `np.int64`
which would be returned as a `BigInt` to JavaScript which would
require an extra step of transformation.

The function `generateDotProductExercise` runs the Python code
asynchronously (so we don't block the app), and then gets the
globals variables from the Python environment. The row and column
counts are just integer, so no transformation is required. The
matrices get returned as an array of `Int32Array`. We use the
`Array.from` class method to convert these to simple arrays. Finally
all the data gets returned in an object.

## Matrix Multiplication Component

Now we can create the shell of the matrix multiplication component.
First we make the folder `src/components`, then create the file
`MatrixMultiplication.js` with the following contents:

```javascript
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { generateDotProductExercise } from '../pythonCode'

const styles = (theme) => ({
  paper: {
    height: '100vh'
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
    float: 'right'
  },
  parameter: {
    width: '12ch',
    margin: theme.spacing(1)
  },
  exercise: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})

class MatrixMultiplication extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pyodide: props.pyodide,
      maxNumberOfRows: 4,
      maxNumberOfColumns: 4,
      hasExercise: false,
      m: 1,
      n: 1,
      p: 1,
      A: [[0]],
      B: [[0]],
      C: [[0]]
    }
  }

  generateExercise = () => {
    const { maxNumberOfRows, maxNumberOfColumns, pyodide } = this.state
    generateDotProductExercise(pyodide, maxNumberOfRows, maxNumberOfColumns)
      .then((result) => {
        this.setState({
          ...result,
          answer: result.C.map((row) => row.map((col) => '')),
          hasExercise: true
        })
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.generateExercise()
  }

  render() {
    const { maxNumberOfRows, maxNumberOfColumns, A, B, C } = this.state
    const { classes } = this.props

    return (
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <form onSubmit={this.handleSubmit}>
            <TextField className={classes.parameter} type="number" value={maxNumberOfRows} label="Max Rows" />
            <TextField className={classes.parameter} type="number" value={maxNumberOfColumns} label="Max Columns" />
            <Button type="submit" variant="outlined" color="primary" className={classes.button}>
              New Exercise
            </Button>
          </form>
          <div className={classes.exercise}>
              <Typography variant="body1">
                  {JSON.stringify(A)} * {JSON.stringify(B)} = {JSON.stringify(C)}
              </Typography>
          </div>
        </Paper>
      </Container>
    )
  }
}

MatrixMultiplication.propTypes = {
  classes: PropTypes.object,
  pyodide: PropTypes.object
}

export default withStyles(styles)(MatrixMultiplication)
```

Looking in the render method we can see the component has two text boxes
for the maximum rows and columns, and a button the generate the exercise.
All of the data we will get back from the Python code we just display as
text for now using `JSON.stringify`. The button calls the method
`generateExercise` which calls the Python code that we created earlier,
and sets the state with the results.

## Wiring it up

Finally we can add the component to the `src/App.js` file.

```javascript
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import MatrixMultiplication from './components/MatrixMultiplication'

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
    window
      .loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.17.0/full/' })
      .then((pyodide) => {
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
    const { version, pyodide } = this.state
    const { classes } = this.props

    return (
      <div className={classes.message}>
        {version == null
          ? <Typography variant="h2">Loading Python</Typography>
          : <MatrixMultiplication pyodide={pyodide} />
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

The only changes we made here were to import the `MatrixMultiplication`
component, and render it with the `this.state.pyodide` object once
Python had been loaded.

Now we can take it for a spin!

```
npm start
```

Clicking the exercise button runs the Python code and displays the
matrix multiplication. The first time we click the button there is a delay
while `numpy` is downloaded.
