/* The image shown below the deck of cards*/

import React from "react";
import { useSelector } from 'react-redux';
import { getCurrentFace, getVisibleFaceSrc } from "../plugins/lotrlcg/functions/helpers";
import useProfile from "../../hooks/useProfile";
import { useCardSize } from "../../hooks/useCardSize";

const CardBack = React.memo(({
  groupType,
  stackIds,
  isDraggingOver,
  isDraggingFrom,
}) => {
  const user = useProfile();
  const playerN = useSelector(state => state?.playerUi?.playerN)
  const stack0 = useSelector(state => state?.gameUi?.game?.stackById[stackIds[0]]);
  const stack1 = useSelector(state => state?.gameUi?.game?.stackById[stackIds[1]]);
  const card0 = useSelector(state => state?.gameUi?.game?.cardById[stack0?.cardIds[0]]);
  const card1 = useSelector(state => state?.gameUi?.game?.cardById[stack1?.cardIds[0]]);
  const cardSize = useCardSize();

  var visibleFaceSrc;
  var visibleFace;
  const groupSize = stackIds.length;
  if (groupType === "deck" && groupSize>0 && isDraggingOver && !isDraggingFrom) {
    visibleFaceSrc = getVisibleFaceSrc(card0, playerN, user)
    visibleFace = getCurrentFace(card0)
  } else if (groupType === "deck" && groupSize>1 && isDraggingFrom) {
    visibleFaceSrc = getVisibleFaceSrc(card1, playerN, user)
    visibleFace = getCurrentFace(card1)
  } else if (groupType === "discard" && groupSize>0 && isDraggingOver && !isDraggingFrom) {
    visibleFaceSrc = getVisibleFaceSrc(card0, playerN, user)
    visibleFace = getCurrentFace(card0)
  } else if (groupType === "discard" && groupSize>1 && isDraggingFrom) {
    visibleFaceSrc = getVisibleFaceSrc(card1, playerN, user)
    visibleFace = getCurrentFace(card1)
  }
  if (visibleFace) {
    return (
        <div 
            style={{
                backgroundColor: "red",
                background: `url(${visibleFaceSrc}) no-repeat scroll 0% 0% / contain`,
                //borderWidth: '1px',
                borderRadius: '0.6vh',
                borderColor: 'transparent',
                position: "absolute",
                width: `${cardSize*visibleFace.width}vh`,
                height: `${cardSize*visibleFace.height}vh`,
                left: `${0.2 + (1.39-visibleFace.width)*cardSize/2}vh`,
                top: "50%", //`${0.2 + (1.39-currentFace.height)*cardSize/2}vw`,
                transform: "translate(0%,-50%)",
            }}
        >                
        <img className="absolute w-full h-full" style={{borderRadius: '0.6vh'}} src={visibleFaceSrc.src} onerror={`this.onerror=null; this.src=${visibleFaceSrc.default}`} />

        </div>)
  } else {
    return (<div></div>);
  }
})

//left: `${0.2 + (1.39-currentFace.width)*CARDSCALE/2 + CARDSCALE/3*cardIndex}vw`,
//top: `${0.2 + (1.39-currentFace.height)*CARDSCALE/2}vw`,

export default CardBack;
