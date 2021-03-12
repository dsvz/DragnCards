import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import RoomGame from "./RoomGame";
import GameUIContext from "../../contexts/GameUIContext";
import {KeypressProvider} from '../../contexts/KeypressContext'
import {ActiveCardProvider} from '../../contexts/ActiveCardContext'
import useChannel from "../../hooks/useChannel";
import { GameUI, ChatMessage } from "elixir-backend";
import { setGame, setPlayerIds } from "./gameUiSlice";

interface Props {
  slug: string;
}

export const Room: React.FC<Props> = ({ slug }) => {
  const gameUiStore = (state: any) => state.gameUi;
  const dispatch = useDispatch();
  const gameUi = useSelector(gameUiStore);

  //const [gameUI, setGameUI] = useState<GameUI | null>(null);
  const onChannelMessage = useCallback((event, payload) => {
    console.log("[room] Got channel message", event, payload);
    console.log("Got new game state: ", payload.response);
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.game_ui != null
    ) {
      const { game_ui } = payload.response;
      console.log("dispatching to game", game_ui.game)
      if (game_ui) {
        dispatch(setGame(game_ui.game));
        dispatch(setPlayerIds(game_ui.playerIds));
      }
    }
  }, []);
  
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const onChatMessage = useCallback((event, payload) => {
    if (
      event === "phx_reply" &&
      payload.response != null &&
      payload.response.messages != null
    ) {
      setMessages(payload.response.messages);
    }
  }, []);
  const gameBroadcast = useChannel(`room:${slug}`, onChannelMessage);
  const chatBroadcast = useChannel(`chat:${slug}`, onChatMessage);

  console.log('rendering room');
  return (
    // <Container>
      <div className="gamebackground"
        style={{height: "97vh"}}
      >

      <KeypressProvider value={[""]}>
        {gameUi != null && (
          //<GameUIContext.Provider value={{gameUI, setGameUI}}>
            <ActiveCardProvider value={null}>
              <RoomGame gameBroadcast={gameBroadcast} chatBroadcast={chatBroadcast} messages={messages}/>
            </ActiveCardProvider>
         //</GameUIContext.Provider>
        )}
        </KeypressProvider>
      </div>
    // </Container>
  );
};
export default Room;
