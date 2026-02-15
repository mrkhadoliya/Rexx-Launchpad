import axios from "axios";
import BASE_URI from "./BASE_URI";


export const callApi = async (header,body,method,subUri) => {
    console.log(`${BASE_URI}${subUri}`)
    if (method=='post'){
        console.log('1')
        return new Promise(async(resolve,reject)=>{
            try{
                let response = await axios.post(`${BASE_URI}${subUri}`,body,{
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