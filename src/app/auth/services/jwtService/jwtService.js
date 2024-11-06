import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);  
            localStorage.removeItem('user');
            localStorage.removeItem('storeName');
            localStorage.removeItem('storeId');
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }else{
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    }

    
  };



  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      
    let role = "store"
    axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/admin/login',{email,password,role}).then((res)=>{
      let datas= res.data.payload
      console.log(datas)
      if(datas.storeId){
        console.log(datas.storeId)
        if (localStorage.getItem('storeId')) {
          // Remove the existing item
          localStorage.removeItem('storeName');
          localStorage.removeItem('storeId');
        }
        
        // Add a new item to localStorage
        localStorage.setItem('storeId', datas.storeId._id);
        localStorage.setItem('storeName', datas.storeId.storeName);
        const response = {
          user:{
           data:{
            displayName:datas.name,
            email:datas.email,
            photoURL:"https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png"
           },
           from:"db",
            role:datas.role,
            uuid:datas._id
          },
          access_token:datas.access_token
        };
          
          this.setSession(response.access_token);
    localStorage.setItem('user',JSON.stringify(response.user))
                  resolve(response.user);
                  this.emit('onLogin', response.user);
      }
   
    }).catch((err)=>{

console.log(err)

err.response? reject(err.response.data.message): reject("Error Occured");
     
      console.log(err.response);
    })
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      // axios
      //   .get(jwtServiceConfig.accessToken, {
      //     data: {
      //       access_token: this.getAccessToken(),
      //     },
      //   })
      //   .then((response) => {
      //     if (response.data.user) {
      //       this.setSession(response.data.access_token);
      //       resolve(response.data.user);
      //     } else {
      //       this.logout();
      //       reject(new Error('Failed to login with token.'));
      //     }
      //   })
      //   .catch((error) => {
      //     this.logout();
      //     reject(new Error('Failed to login with token.'));
      //   });
      const user = JSON.parse(localStorage.getItem('user'));
      const storeId = localStorage.getItem('storeId');
      
      let token = localStorage.getItem('jwt_access_token');
      if (user && storeId ) {
        this.setSession(token);
        resolve(user);
      }else{
        this.logout()
        reject(new Error('Failed to login with token.'))
      }
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    localStorage.removeItem('user');
    localStorage.removeItem('storeId');
    localStorage.removeItem('storeName');
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    
    return localStorage.getItem('jwt_access_token');
  };
}

const instance = new JwtService();

export default instance;
