import {useEffect,useState} from "react";
export default ()=>{
 const [u,setU]=useState([]);
 useEffect(()=>{
  fetch("http://localhost:3001/api/users",{
   headers:{Authorization:"Bearer TEST"}
  }).then(r=>r.json()).then(setU);
 },[]);
 return <ul>{u.map(x=><li key={x.id}>{x.email}-{x.role}</li>)}</ul>;
};