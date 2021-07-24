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
