import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Badge,
    Stack, Code,  
    Center, Button,
    HStack, VStack, Flex, useClipboard 
  } from '@chakra-ui/react';
import { DreamAuthor } from "./shared/DreamAuthor";
import { dt } from '../utils/dateUtils'

export function Piece() {
    // const IMAGE_HOST = "http://www.feverdreams.app.s3-website-us-east-1.amazonaws.com"
    const IMAGE_HOST = "https://www.feverdreams.app"
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tp, setTP] = useState('')
    const { hasCopied, onCopy } = useClipboard(tp)
    let params = useParams();
    
    function fetchPiece() {
      let uuid = params.uuid
      fetch(`https://api.feverdreams.app/job/${uuid}`)
      .then((response) => {
        let obj = response.json()
        return obj
      })
      .then((actualData) => {
        console.log(actualData)
        setData(actualData);
        setTP(actualData.text_prompt)
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
    
    useEffect(() => {
        fetchPiece()
    },[]);
    
    return <>
        {error}
        {!loading && <div>
        <VStack alignItems={"left"} paddingLeft={3} paddingRight={3}>
          <VStack>
            <Heading as='h3' size='lg'>{params.uuid}</Heading>
              <Link textDecoration="none" isExternal href={
                  (data.status === 'processing')?`${IMAGE_HOST}/images/${params.uuid}_progress.png`
                  :`${IMAGE_HOST}/images/${params.uuid}0_0.png`
                }>
              <Image maxH="768" borderRadius="lg" alt={data.text_prompt} objectFit="cover" src={
                  (data.status === 'processing')?`${IMAGE_HOST}/images/${params.uuid}_progress.png`
                  :`${IMAGE_HOST}/images/${params.uuid}0_0.png`
                } />
            </Link>
            <Code variant={"solid"}>{tp}</Code>
            <Button onClick={onCopy} ml={2}>
              {hasCopied ? 'Copied' : 'Copy'}
            </Button>
          </VStack>
          <Box align="left" bg="blackAlpha.400" p="3" borderRadius="lg" borderWidth={1}>
            <DreamAuthor userdets={data.userdets} /><Text>{dt(data.timestamp)}</Text>
          <Stack direction='row'>
            <Badge variant='outline' colorScheme='green'>{data.model}</Badge>
            <Badge variant='outline' colorScheme='green'>{data.render_type}</Badge>
            <Badge variant='outline' colorScheme='green'>{`${data.steps} steps`}</Badge>
          </Stack>
          <Stack direction='row'>
            <Link color='green.500' isExternal href={`https://api.feverdreams.app/job/${params.uuid}`}>Job Details <ExternalLinkIcon mx='2px' /></Link> | <Link color='green.500' isExternal href={`https://api.feverdreams.app/config/${params.uuid}`}>YAML <ExternalLinkIcon mx='2px' /></Link>
          </Stack>
          </Box>
        </VStack>
        </div>}
    </>;
}