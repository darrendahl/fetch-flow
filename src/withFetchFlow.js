import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { SpinnerGoogle, Error } from 'components'

const withFetchFlow = ({ getFetchAction, refs = {} }) => {
  return WrappedComponent => {
    @connect(({ app }) => {
      const { loadingFlags, isError } = app
      const isLoading = loadingFlags[refs.isLoading]
      const dataLoaded = loadingFlags[refs.dataLoaded]
      return {
        isLoading,
        dataLoaded,
        isError
      }
    })
    @withRouter
    class ApiFlowWrapper extends React.Component {
      componentDidMount() {
        const { history, dataLoaded } = this.props

        let action = getFetchAction(this.props)

        // detects back button pressing, dont fetch on back button
        if (history.action === 'POP' && !!dataLoaded) {
          return
        }

        action.isLoading = true
        action.refs = refs
        this.props.dispatch(action)
      }

      componentWillReceiveProps(nextProps) {
        const { history, location } = this.props
        // detects refresh by clicking nav button, refreshes if clicked
        let action = getFetchAction(nextProps)
        if (
          history.action === 'PUSH' &&
          nextProps.location.key !== location.key &&
          location.pathname === nextProps.location.pathname
        ) {
          action.isLoading = true
          action.refs = refs
          this.props.dispatch(action)
        }
      }

      render() {
        if (this.props.isError) {
          return <Error />
        }

        if (this.props.isLoading) {
          return <SpinnerGoogle />
        }

        return <WrappedComponent {...this.props} />
      }
    }
    return ApiFlowWrapper
  }
}

export default withFetchFlow
