import { useState, useEffect } from "react";
import { SimpleGrid } from '@chakra-ui/react'
import { useParams } from "react-router-dom";
import Preview from "./Preview";


export default function Feed({type, amount, user_id}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let params = useParams();
    console.log(params)
    let page = params.page?params.page:1
    if (params.amount) {amount = params.amount}
    function fetchFeed(type, amount, user_id) {
      let url = `https://api.feverdreams.app/${type}/${amount}/${page}`
      if (type==="random"){
        url = `https://api.feverdreams.app/${type}/${amount}`
      }
      if(user_id){
        url = `https://api.feverdreams.app/userfeed/${user_id}/${amount}/${params.page}`
      }
      console.log(url)
      fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
    }

    // https://exerror.com/react-hook-useeffect-has-a-missing-dependency/
    useEffect(() => {
      fetchFeed(type, amount, params.user_id)
    },[ type, amount, params.user_id]);
    return (
      
        <div>
          {loading && <div>A moment please...</div>}
          {error && (
            <div>{`There is a problem fetching the post data - ${error}`}</div>
          )}
          <SimpleGrid minChildWidth='256px' spacing = {20}>
          {data &&
            data.map(({ uuid, author, text_prompt, render_type, duration, userdets, timestamp}) => (
              <Preview userdets={userdets} timestamp={timestamp} key={uuid} uuid={uuid} text_prompt={text_prompt} render_type={render_type} duration={duration}/>
            ))}
          </SimpleGrid>
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Welcome to Fever Dreams
            </p>
          </header> */}
        </div>
    );
  }