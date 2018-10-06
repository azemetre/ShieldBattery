import React from 'react'
import styled from 'styled-components'

import FlatButton from '../material/flat-button.jsx'
import TextField from '../material/text-field.jsx'
import CheckBox from '../material/check-box.jsx'

import { fastOutSlowIn } from '../material/curve-constants'
import { colorError, colorSuccess, colorTextSecondary } from '../styles/colors'
import { Display1 } from '../styles/typography'

export const AuthContent = styled.div`
  position: relative;
  width: 100%;
`

export const AuthTitle = Display1.withComponent('h3').extend`
  text-align: center;
  margin-top: 0;
`

export const AuthBody = styled.div`
  width: 100%;
  padding-left: 24%;
  padding-right: 24%;
`

export const LoadingArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

export const ErrorsContainer = styled.div`
  flex-grow: 1;
  color: ${colorError};
`

export const SuccessContainer = styled.p`
  flex-grow: 1;
  color: ${colorSuccess};
`

export const AuthBottomAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
`

export const BottomActionButton = styled(FlatButton)`
  // TODO(2Pac): Do this properly (by generating this css here and sending it as a prop to the
  // Button) once the Button gets rewritten as a styled component
  & > span {
    color: ${colorTextSecondary};
    font-weight: 400;
  }
`

export const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 16px;
`

export const RowEdge = styled.div`
  flex: 1 1 24%;
  max-width: 24%;
  max-height: 100%;

  & > * {
    float: right;
  }
`

export const ForgotActionButton = styled(FlatButton)`
  // TODO(2Pac): Do this properly (by generating this css here and sending it as a prop to the
  // Button) once the Button gets rewritten as a styled component
  & > span {
    color: ${colorTextSecondary};
    font-weight: 400;
    font-size: 12px;
  }
`

export const Spacer = styled.div`
  flex-grow: 1;
`

export const AuthTextField = styled(TextField)`
  flex-grow: 1;
`

export const AuthCheckBox = styled(CheckBox)`
  flex: 1 1 33.33%;
  max-width: 33.33%;
  max-height: 100%;
`

export const Content = styled.div`
  opacity: 1;
  transition: opacity 150ms ${fastOutSlowIn};
`

export const ContentLoading = Content.extend`
  pointer-events: none;
  opacity: 0;
`

export class AuthContentContainer extends React.Component {
  render() {
    return this.props.isLoading ? (
      <ContentLoading>{this.props.children}</ContentLoading>
    ) : (
      <Content>{this.props.children}</Content>
    )
  }
}