import PlayerEntry from '../PlayerEntry';

export default function PlayerEntryExample() {
  return (
    <PlayerEntry onEnterGame={(name, persona) => console.log('Entering game:', name, persona)} />
  );
}