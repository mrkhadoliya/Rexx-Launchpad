import axios from 'axios';
import BASE_URI from './BASE_URI';

export const apiCall = async (header, subUri, method, body) => {
  console.log(header, 'header');
  console.log(subUri, 'subUri');
  console.log(method, 'Method');
  console.log(body, 'Body');
  console.log(`${BASE_URI}${subUri}`, 'kkk');

//   return new Promise(async (resolve, reject) => {
//     try {
//       let response = await axios.post(`${BASE_URI}${subUri}`, body, {
//         headers: header,
//       });
//       resolve(response);
//       console.log(response.data, ' Response----- in api');
//     } catch (error) {
//       reject(error);
//       console.log(error, ' Error in api');
//     }
//   });
// };

if (method=='post'){
  console.log('1')
  return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.post(`${BASE_URI}${subUri}`, body, {
            headers: header,
          });
          resolve(response);
          console.log(response.data, ' Response----- in api');
        } catch (error) {
          reject(error);
          console.log(error, ' Error in api');
        }
      });
}
else{
  return new Promise(async(resolve,reject)=>{
      console.log('this')
      try{
          let response = await axios.get(`${BASE_URI}${subUri}`,{
              headers:header
          })
          console.log(response," response in api")
          resolve(response);
      }
      catch(err){
          console.log(err," err in api")
          reject(err);
      }
  })
}
}
