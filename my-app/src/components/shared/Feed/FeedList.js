import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Link,
  Image,
  IconButton,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
  useColorModeValue,
  Container,
  Code,
  VStack,
  Button,
  SimpleGrid
} from '@chakra-ui/react';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';

const PieceTags = (props) => {
  return (
    <Wrap spacing={2} marginTop={props.marginTop}>
      {props.tags.map((tag) => {
        return (
          <WrapItem>
            <Tag size={'md'} variant="solid" key={tag}>
              {tag}
            </Tag>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export const Piece = (props) =>{
  let {piece, isAuthenticated, user, token, onDecided} = props
  const { loginWithRedirect } = useAuth0()
  const [isLoading, setIsLoading] = useState(false)
  const [decided, setDecided] = useState(false)
  return (<Container maxW={'7xl'} p="5">
      {/* <Heading as="h1">Stories by Chakra Templates</Heading> */}
      <Heading size={"sm"}>
        <Link textDecoration="none" _hover={{ textDecoration: 'none' }} style={{overflowWrap:"anywhere"}}>
          {piece.uuid}
        </Link>
      </Heading>
      <Box
        marginTop={{ base: '1', sm: '5' }}
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between">
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          alignItems="center">
          <Box
            width={{ base: '100%', sm: '85%' }}
            zIndex="2"
            marginLeft={{ base: '0', sm: '5%' }}
            marginTop="5%">
            <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
              <Image
                borderRadius="lg"
                src={`http://images.feverdreams.app/thumbs/512/${piece.preferredImage || piece.uuid}.jpg`}
                alt={piece.uuid}
                objectFit="contain"
              />
            </Link>
          </Box>
          <Box zIndex="1" width="100%" position="absolute" height="100%">
            <Box
              // bgGradient={useColorModeValue(
              //   'radial(orange.600 1px, transparent 1px)',
              //   'radial(orange.300 1px, transparent 1px)'
              // )}
              backgroundSize="20px 20px"
              opacity="0.4"
              height="100%"
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          // justifyContent="center"
          marginTop={{ base: '3', sm: '0' }}>
          <Wrap mb={5}>
            <IconButton
              // style={{
              //   position : "absolute",
              //   top : 0,
              //   left : 0,
              //   zIndex : 2
              // }}
              isRound
              colorScheme={'green'}
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                if(!isAuthenticated){
                  loginWithRedirect()
                }else{
                  let method = "POST"
                  setDecided(true)
                  if(onDecided) onDecided()
                  fetch(
                    `${process.env.REACT_APP_api_url}/review/${piece.uuid}`,{
                      method: method,
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ }),
                    })
                }
              }}
              icon={<AiOutlineSave />}
            />
          <IconButton
            // style={{
            //   position : "absolute",
            //   top : 0,
            //   right : 0,
            //   zIndex : 2
            // }}
            isRound
            colorScheme={'red'}
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              if(!isAuthenticated){
                loginWithRedirect()
              }else{
                let method = "DELETE"
                setDecided(true)
                if(onDecided) onDecided()
                fetch(
                  `${process.env.REACT_APP_api_url}/review/${piece.uuid}`,
                  {
                    method: method,
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ }),
                  }
                )
              }
            }}
            icon={<AiOutlineDelete />}/>
          </Wrap>
          <PieceTags tags={[piece.params.sampler, `Seed: ${piece.params.seed}`, `Scale: ${piece.params.scale}`, `Steps: ${piece.params.steps}`]} />
          <Text
            as="p"
            marginTop="2"
            color={useColorModeValue('gray.700', 'gray.200')}
            fontSize="lg">
            <Code>{piece.params.prompt}</Code>
          </Text>
          {piece.userdets && <PieceAuthor name="John Doe" date={new Date('2021-04-06T19:01:27Z')} />}
        </Box>
      </Box>     
    </Container>)
}

export const PieceAuthor = (props) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${props.name}`}
      />
      <Text fontWeight="medium">{props.name}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

const FeedList = (props) => {
  let {pieces, isAuthenticated, user, token, onDelete} = props
  return (
    <SimpleGrid columns={{sm: 1, md: 1, lg: 2}} spacing={10}>{pieces && pieces.map((piece, index)=>{
      return <Piece key={index} piece = {piece} isAuthenticated={isAuthenticated} user={user} token={token} onDecided={()=>{
        if (onDelete) onDelete(index)
      }}/>
    })}
      
    </SimpleGrid>
  );
};

export default FeedList;