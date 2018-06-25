'use strict'

import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import cloneReferencedElement from 'react-clone-referenced-element'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import ScrollableMixin from 'react-native-scrollable-mixin'

class InvertibleScrollView extends Component {
  static propTypes = {
    ...ScrollView.propTypes,
    inverted: PropTypes.bool,
    renderScrollComponent: PropTypes.func.isRequired
  }
  static defaultProps = {
    inverted: true,
    renderScrollComponent: props => <ScrollView {...props} />
  }

  getScrollResponder () {
    return this._scrollComponent.getScrollResponder()
  }

  setNativeProps (props) {
    this._scrollComponent.setNativeProps(props)
  }

  render () {
    const {
      inverted,
      renderScrollComponent,
      ...props
    } = this.props

    if (inverted) {
      if (this.props.horizontal) {
        props.style = [styles.horizontallyInverted, props.style]
        props.children = this._renderInvertedChildren(props.children, styles.horizontallyInverted)
      } else {
        props.style = [styles.verticallyInverted, props.style]
        props.children = this._renderInvertedChildren(props.children, styles.verticallyInverted)
      }
    }

    return cloneReferencedElement(renderScrollComponent(props), {
      ref: component => { this._scrollComponent = component }
    })
  }

  _renderInvertedChildren (children, inversionStyle) {
    return React.Children.map(children, child => {
      return child ? <View style={inversionStyle}>{child}</View> : child
    })
  }
}

const styles = StyleSheet.create({
  verticallyInverted: {
    flex: 1,
    transform: [
      { scaleY: -1 }
    ]
  },
  horizontallyInverted: {
    flex: 1,
    transform: [
      { scaleX: -1 }
    ]
  }
})
// Mix in ScrollableMixin's methods as instance methods
Object.assign(InvertibleScrollView.prototype, ScrollableMixin)
export default InvertibleScrollView