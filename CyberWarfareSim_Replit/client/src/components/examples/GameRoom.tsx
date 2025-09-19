import GameRoom from '../GameRoom';
import { PERSONAS } from "@shared/schema";

export default function GameRoomExample() {
  return (
    <GameRoom
      currentPlayer={{ name: "Alex Chen", persona: PERSONAS.CISO }}
      onLeaveGame={() => console.log('Leaving game')}
    />
  );
}