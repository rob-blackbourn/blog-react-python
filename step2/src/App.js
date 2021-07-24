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
      version: null
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
            this.setState({ version })
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
