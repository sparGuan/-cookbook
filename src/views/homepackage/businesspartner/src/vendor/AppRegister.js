import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import classNames from 'classnames';

const styles = theme => ({
  root: {

  },
  paperContent: {
    boxShadow: 'unset'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  },
  validTxtColor: {
    position: 'absolute',
    top: 20,
    right: 0,
    fontSize: 13,
    color: 'rgba(74, 74, 74, 1)'
  },
  getTheCode: {
    minWidth: 200
  }
});

class AppRegister extends React.Component {
  state = {
    showPassword: false,
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  // 值改变for注册信息
  render() {
    const { classes, openPages, registerData } = this.props;
    return (
      <Zoom in={openPages === 2} style={{
        display: openPages === 2 ? 'block' : 'none'
      }}>
        <Paper elevation={4} className={classes.paperContent}>
          {/** 注册  */}
          <FormControl className={classes.margin}>
            <InputLabel htmlFor="input-with-icon-adornment">请输入手机号</InputLabel>
            <Input
              id="input-with-icon-adornment"
              value={registerData.Mobile}
              type="number"
              onChange={this.props.handleChangeObject('registerData.Mobile')}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl className={classNames(classes.margin, classes.textField, classes.getTheCode)}>
            <InputLabel htmlFor="adornment-password" >验证码</InputLabel>
            <Input
              id="adornment-password"
              value={registerData.validCode}
              onChange={this.props.handleChangeObject('registerData.validCode')}
              />
             
              <span className={classes.validTxtColor} onClick={ () => {
                this.props.sendValid(registerData.Mobile, true)
              }}> {this.props.validCodeTxt}</span>
          </FormControl>

          <FormControl className={classNames(classes.margin, classes.textField)}>
            <InputLabel htmlFor="adornment-password">中英文8位密码</InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={registerData.passWord}
              onChange={this.props.handleChangeObject('registerData.passWord')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Paper>
      </Zoom>
    );
  }
}

AppRegister.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppRegister);