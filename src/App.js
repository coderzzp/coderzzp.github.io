import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react'

const fistDayTime = 1597593600000
const now = new Date().getTime()
const diffinit = ~~((now-fistDayTime )/1000 )

function App() {
  const [diff,setDiff] = useState(diffinit)
  useEffect(()=>{
    const id = setTimeout(()=>{
      setDiff(diff+1)
    },1000)
    return ()=>{
      clearTimeout(id)
    }
  },[diff])
  const day = ~~(diff/(24 * 60 * 60))
  const hour = ~~((diff % (24 * 60 * 60) )/(60*60))
  const minute =~~(((diff % (24 * 60 * 60) )%(60*60))/60)
  const seconds =~~(((diff % (24 * 60 * 60) )%(60*60))%60)
  const show = (time)=>{
    if(time.toString().length<=1){
      return `0${time}`
    }else{
      return time
    }
  }
  return (
    <div className="App">
     
      <img src={'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202002%2F08%2F20200208134336_MWhRd.thumb.400_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634401498&t=4362295d3dd269df6945e841c669101d'}></img>
      <p> zzp ❤ xqy </p>
       {day}D{show(hour)}H{show(minute)}M{show(seconds)}S
      
    </div>
  );
}

export default App;
